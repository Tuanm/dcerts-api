import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export function logRequest(req: Request, res: Response, next: NextFunction) {
    const request = JSON.stringify({
        userAgent: req.headers['user-agent'],
        method: req.method,
        path: req.originalUrl,
    });
    logger.info(`Request: ${request}`);
    return next();
}