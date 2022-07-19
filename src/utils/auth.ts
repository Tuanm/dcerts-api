import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { configuration } from '.';

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
    id?: string,
    nonce?: string,
    exp?: number,
} {
    try {
        return jwt.verify(token, configuration()?.app.auth.secret) as jwt.JwtPayload & {
            id: string,
            nonce: string,
        };
    } catch (err) {
        return {};
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
    if (!token) throw new Error();
    const payload = verifyToken(token);
    if (!payload || !payload.id) throw new Error();
    const expired = !payload.exp
        ? true
        : payload.exp * 1000 < Date.now();
    if (expired) throw new Error();
    return payload.id;
}

/**
 * Retrieves the account identity from a request.
 */
export function getAccountFromRequest(req: Request) {
    return validateJwt(req);
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