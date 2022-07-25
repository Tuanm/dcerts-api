import { db } from '.';
import logger from '../../utils/logger';
import { Content } from './entities/content';
import { Entity } from './entities/entity';

const collection = 'contents';

export async function add(content: Content & Entity) {
    try {
        content.createdAt = Date.now();
        content.locked = false;
        const result = await db.insertOne(collection, content) || {};
        return result;
    } catch (err: any) {
        logger.error(err?.message)
    }
}

export async function update(content: Content & Entity) {
    content.updatedAt = Date.now();
    return db.updateOne(collection, {
        group: content.group,
        id: content.id,
    }, content) || {};
}

export async function contentsOfBatch(batch: number) {
    return db.search(collection, { batch }) || [];
}