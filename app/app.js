const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
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

const app = express();

mongoose.connect('mongodb://app-user:app-password@localhost:27017/appdb', { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'my-secret',
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

/* Routers */
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/roles', roleRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
