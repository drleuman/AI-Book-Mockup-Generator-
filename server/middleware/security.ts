
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

// Helmet for basic security headers
export const securityHeaders = helmet({
    contentSecurityPolicy: false, // Disable CSP if serving frontend from same origin/domain during dev
    crossOriginEmbedderPolicy: false
});

// Rate limiter for single generation
export const singleGenLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 8, // limit each IP to 8 requests per windowMs
    message: {
        status: 'error',
        code: 'RATE_LIMITED',
        message: 'TOO_MANY_REQUESTS: RETRY_AFTER_60S'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for batch generation
export const batchGenLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // limit each IP to 3 batch requests per 5 minutes
    message: {
        status: 'error',
        code: 'BATCH_RATE_LIMITED',
        message: 'TOO_MANY_BATCH_REQUESTS: RETRY_AFTER_5M'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Global error handler for sanitized responses
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[SYSTEM_FAULT] ${new Date().toISOString()}:`, err.message || err);

    const publicMessage = err.message?.startsWith('CRITICAL_FAULT') 
        ? err.message 
        : 'INTERNAL_SERVER_ERROR: UNEXPECTED_FAULT';

    res.status(err.status || 500).json({
        status: 'error',
        code: err.code || 'SYSTEM_FAULT',
        message: publicMessage
    });
};
