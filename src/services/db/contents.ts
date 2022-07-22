import { db } from '.';
import { Content } from './entities/content';
import { Entity } from './entities/entity';

const collection = 'contents';

export async function add(content: Content & Entity) {
    content.createdAt = Date.now();
    content.locked = false;
    return db.insertOne(collection, content) || {};
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