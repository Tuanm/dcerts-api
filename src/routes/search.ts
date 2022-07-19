import { Router } from 'express';
import { search } from '../services/search';
import { getAccountFromRequest } from '../utils/auth';

const router = Router();

router.get('/:collection', async (req, res) => {
    const accountId = getAccountFromRequest(req);
    const collection = req.params.collection;
    const query = req.query;
    res.json(await search(accountId, collection, query));
});

export default router;