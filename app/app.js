const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {INTERNAL_SERVER_ERROR, getStatusText } = require('http-status-codes');
const swaggerJSDoc = require('./components/swagger');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const passport = require('passport');
const passportLocal = require('passport-local');
const passportGithub = require('passport-github2');
const passportGoogle = require('passport-google-oauth20');

const userLocalStrategy = require('./strategies/userLocalStrategy');
const userGithubStrategy = require('./strategies/userGithubStrategy');
const userGoogleStrategy = require('./strategies/userGoogleStrategy');

const userSerializer = require('./serializers/userSerializer');

const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const roleRouter = require('./routes/role');
const userRouter = require('./routes/user');
const userRolesRouter = require('./routes/user-roles');
const userSessionsRouter = require('./routes/user-sessions');

const logger = require('./components/logger');

const app = express();

const { env } = process;

const mongoConnectionString = `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}`;

mongoose.connect(mongoConnectionString, { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(userSerializer.serialize);
passport.deserializeUser(userSerializer.deserialize);

passport.use(new passportLocal.Strategy(
    userLocalStrategy.settings,
    userLocalStrategy.strategy
));

passport.use(new passportGithub.Strategy(
    userGithubStrategy.settings,
    userGithubStrategy.strategy
));

passport.use(new passportGoogle.Strategy(
    userGoogleStrategy.settings,
    userGoogleStrategy.strategy
));

app.use(express.static(path.join(__dirname, 'public')));

/* Swagger */
if (app.get('env') !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));
}

/* Routers */
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/roles', roleRouter);
app.use('/users', userRouter);
app.use('/user-roles', userRolesRouter);
app.use('/user-sessions', userSessionsRouter);

/* Not Found Error */
app.use((req, res, next) => {
    next(createError(404));
})

/* Errors Handler */
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    const status = err.status || INTERNAL_SERVER_ERROR;
    const details = err.details ? JSON.stringify(err.details) : 'none';

    logger.error(`${status} - ${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}. Details: ${details}`);

    let message;

    if (req.app.get('env') === 'development') {
        message = err.details || err.message || getStatusText(INTERNAL_SERVER_ERROR);
    } else {
        message = err.details || getStatusText(INTERNAL_SERVER_ERROR);
    }

    res
        .status(status)
        .json({ message });
});

module.exports = app;
