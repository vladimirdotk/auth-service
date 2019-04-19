import { validationResult, ValidationChain } from 'express-validator/check';
import { UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IError } from './../interfaces/error';

const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationError: IError  = new Error('Validation error');
        validationError.status = UNPROCESSABLE_ENTITY;
        validationError.details = errors.array();
        return next(validationError);
    }

    next();
};

export const validate = (validationChains: ValidationChain[]): RequestHandler[] => {
    return [
        ...validationChains,
        validationMiddleware,
    ];
};
