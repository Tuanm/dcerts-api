import { NextFunction, Request, Response } from 'express';
import { generateToken, isSignatureValid, randomizeText, validateJwt } from '../utils/auth';
import { groupsOfMember } from './db/groups';
import { Error } from '../services/error';

const NONCE_MAX_LENGTH = 16;
const NONCE_RESET_INTERVAL = 60000;

/**
 * Available nonces.
 */
const nonces = {
    prev: randomizeText(NONCE_MAX_LENGTH),
    now: randomizeText(NONCE_MAX_LENGTH),
    next: randomizeText(NONCE_MAX_LENGTH),
};

setInterval(() => {
    nonces.prev = nonces.now;
    nonces.now = nonces.next;
    nonces.next = randomizeText(NONCE_MAX_LENGTH);
}, NONCE_RESET_INTERVAL);

export async function getNonce() {
    return nonces.next;
}

export async function validateSignature(accountId: string, signature: string) {
    for (const nonce of [nonces.next, nonces.now, nonces.prev]) {
        if (isSignatureValid(nonce, accountId, signature)) {
            const groups = await groupsOfMember(accountId);
            const randomIndex = Math.floor(Math.random() * groups.length);
            return generateToken({
                id: accountId,
                nonce: groups[randomIndex],
            });
        }
    }
    throw Error.of(401, 'Signature invalid');
}

/**
 * Permits the requests with valid JWT included.
 */
export function filterJwt(req: Request, res: Response, next: NextFunction) {
    validateJwt(req);
    return next();
}