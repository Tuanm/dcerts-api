import { db } from '.';
import { Entity } from './entities/entity';
import { Vote } from './entities/vote';

const collection = 'votes';

export async function add(vote: Vote & Entity) {
    vote.createdAt = Date.now();
    return db.insertOne(collection, vote);
}