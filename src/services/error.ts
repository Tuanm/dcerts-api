import 'express-async-errors';

import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';


export class Error {
    timestamp: number;
    status: number;
    path: string | undefined | null;
    code: string | undefined | null;
    message: string | undefined | null;

    constructor(
        status: number,
        path?: string | null,
        code?: string | null,
        message?: string,
    ) {
        this.timestamp = Date.now();
        this.status = status;
        this.path = path;
        this.code = code;
        this.message = message;
    }

    static of(status: number, message?: string) {
        return new Error(status, null, null, message);
    }

    beautified(): string {
        return JSON.stringify(this, null, 2);
    }
}

export function handleError(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Error) {
        err.path = req.originalUrl;
        logger.error(err.beautified());
    } else {
        logger.error(err?.message);
        err = new Error(500, req.originalUrl, null, err?.message);
    }
    return res.status(err?.status).json(err);
}

export function handleNotFound(req: Request, res: Response, next: NextFunction) {
    const err = new Error(404, req.originalUrl, null, 'Not found');
    logger.error(err.beautified());
    return res.status(err.status).json(err);
}