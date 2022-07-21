import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { configuration } from '.';
import { Error } from '../services/error';

/**
 * Generates a JWT for a specific account.
 */
export function generateToken(account: {
    id: string,
    nonce: string
}) {
    return jwt.sign(account, configuration()?.app.auth.secret, {
        expiresIn: configuration()?.app.auth.validity,
    });
}

function verifyToken(token: string): {
    id: string,
    nonce?: string,
    exp?: number,
} {
    try {
        return jwt.verify(token, configuration()?.app.auth.secret) as jwt.JwtPayload & {
            id: string,
            nonce: string,
        };
    } catch (err) {
        return {
            id: '',
        };
    }
}

/**
 * Returns a random text with a specific length.
 */
export function randomizeText(length: number) {
    return (Math.random() * Math.random()).toString(36) // 0.xxx
        .substring(2, length <= 2 ? 2 + length : length);
}

function getTokenFromRequest(req: Request) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return '';
    }
    return authorization.split(' ')[1];
}

/**
 * Validates the JSON Web Token (JWT) of the request.
 */
export function validateJwt(req: Request) {
    const token = getTokenFromRequest(req);
    if (!token) throw Error.of(401, 'Token must be included');
    const payload = verifyToken(token);
    if (!payload || !payload.id) throw Error.of(401, 'Token invalid');
    const expired = !payload.exp
        ? true
        : payload.exp * 1000 < Date.now();
    if (expired) throw Error.of(401, 'Token expired');
    const accountId = payload.id;
    return accountId;
}

/**
 * Retrieves the account identity from a request.
 */
export function getAccountFromRequest(req: Request) {
    const token = getTokenFromRequest(req);
    const { id } = verifyToken(token);
    return id;
}

/**
 * Validates the signature of a given message.
 */
export function isSignatureValid(
    message: string,
    accountId: string,
    signature: string,
) {
    const hex = bufferToHex(Buffer.from(message, 'utf-8'));
    const address = recoverPersonalSignature({
        data: hex,
        sig: signature,
    });

    return address.toLowerCase() === accountId.toLowerCase();
}