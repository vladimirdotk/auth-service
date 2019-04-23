import { Request, Response, NextFunction } from 'express';
import express = require('express');
import path = require('path');
import dotenv = require('dotenv');
import createError = require('http-errors');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import session = require('express-session');
import passport = require('passport');

import { INTERNAL_SERVER_ERROR, getStatusText } from 'http-status-codes';

import passportLocal = require('passport-local');
import passportGithub = require('passport-github2');
import passportGoogle = require('passport-google-oauth20');
import * as userLocalStrategy from './strategies/userLocalStrategy';
import * as userGithubStrategy from './strategies/userGithubStrategy';
import * as userGoogleStrategy from './strategies/userGoogleStrategy';

import { IError } from './interfaces/error';

import logger from './components/logger';

import { serialize, deserialize } from './serializers/userSerializer';

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import roleRouter from './routes/role';
import userRouter from './routes/user';
import userRoleRouter from './routes/user-role';
import userSessionRouter from './routes/user-session';

dotenv.config();

const app = express();

const { env } = process;

/* Mongo setup */
// tslint:disable-next-line: max-line-length
const mongoConnectionString = `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}`;
mongoose.connect(mongoConnectionString, { useNewUrlParser: true });
const mongoStore = require('connect-mongo')(session);

/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* Parsers */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* Session */
app.use(session({
    secret: env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize());
app.use(passport.session());

/* User serializer */
passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

/* Pasport strategies */
passport.use(new passportLocal.Strategy(
    userLocalStrategy.settings,
    userLocalStrategy.strategy,
));
passport.use(new passportGithub.Strategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: process.env.GITHUB_CALLBACK_URL!,
        passReqToCallback: <true>true,
    },
    userGithubStrategy.strategy,
));
passport.use(new passportGoogle.Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    userGoogleStrategy.strategy,
));

/* Serve static */
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/roles', roleRouter);
app.use('/users', userRouter);
app.use('/user-roles', userRoleRouter);
app.use('/user-sessions', userSessionRouter);

/* Not Found Error */
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

/* Error Handler */
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    const status = err.status || INTERNAL_SERVER_ERROR;
    const details = err.details ? JSON.stringify(err.details) : 'none';

// tslint:disable-next-line: max-line-length
    logger.error(`${status} - ${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}. Details: ${details}`);

    let message: string | IError['details'];

    if (req.app.get('env') === 'development') {
        message = err.details || err.message || getStatusText(INTERNAL_SERVER_ERROR);
    } else {
        message = err.details || getStatusText(INTERNAL_SERVER_ERROR);
    }

    res.status(status).json({ message });
});

export default app;
