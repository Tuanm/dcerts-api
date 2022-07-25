import { db } from '.';
import logger from '../../utils/logger';
import { Entity } from './entities/entity';
import { Vote } from './entities/vote';

const collection = 'votes';

export async function add(vote: Vote & Entity) {
    try {
        vote.createdAt = Date.now();
        const result = await db.insertOne(collection, vote);
        return result;
    } catch (err: any) {
        logger.error(err?.message)
    }
}