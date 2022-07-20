import { Router } from 'express';
import { getNonce, validateSignature } from '../services/auth';

const router = Router();

router.get('/', async (req, res) => {
    const nonce = await getNonce();
    res.json(nonce);
});

router.post('/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const signature = req.body.signature;
    const token = await validateSignature(accountId, signature);
    res.json(token);
});

export default router;