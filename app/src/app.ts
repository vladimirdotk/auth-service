import { Request, Response, NextFunction } from 'express';
import express = require('express');
import path = require('path');
import dotenv = require('dotenv');
import createError = require('http-errors');

import logger from './components/logger';

import indexRouter from './routes/index';

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use('/', indexRouter);

/* Not Found Error */
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

app.listen(3000, () => {
    logger.info(`Listening on ${process.env.APP_PORT}`);
});
