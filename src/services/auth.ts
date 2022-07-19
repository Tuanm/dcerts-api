import { Request } from 'express';
import { generateToken, isSignatureValid, randomizeText, validateJwt } from '../utils/auth';

const NONCE_MAX_LENGTH = 16;
const NONCE_RESET_INTERVAL = 60000;

/**
 * Available nonces.
 */
const nonces = {
    prev: '',
    now: '',
    next: '',
};

setInterval(() => {
    nonces.prev = nonces.now;
    nonces.now = nonces.next;
    nonces.next = randomizeText(NONCE_MAX_LENGTH);
}, NONCE_RESET_INTERVAL);

export async function getNonce(accountId: string) {
    // TODO: Validates account with group info.
    return nonces.next;
}

export async function validateSignature(accountId: string, signature: string) {
    for (const nonce of [nonces.next, nonces.now, nonces.prev]) {
        if (isSignatureValid(nonce, accountId, signature)) {
            return generateToken({
                id: accountId,
                nonce: nonce,
            });
        }
    }
    throw new Error();
}

/**
 * Permits the requests with valid JWT included.
 */
export async function filterJwt(req: Request) {
    const accountId = await validateJwt(req);
}