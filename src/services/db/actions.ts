import { db } from '.';
import logger from '../../utils/logger';
import { Action } from './entities/action';
import { Entity } from './entities/entity';

const collection = 'actions';

export async function add(action: Action & Entity) {
    try {
        action.createdAt = Date.now();
        action.executed = false;
        action.cancelled = false;
        const result = await db.insertOne(collection, action);
        return result;
    } catch (err: any) {
        logger.error(err?.message)
    }
}

export async function update(action: Action & Entity) {
    action.updatedAt = Date.now();
    return db.updateOne(collection, {
        group: action.group,
        id: action.id,
    }, action);
}