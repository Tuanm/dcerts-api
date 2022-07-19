import { db } from '.';
import { Action } from './entities/action';
import { Entity } from './entities/entity';

const collection = 'actions';

export async function add(action: Action & Entity) {
    action.createdAt = Date.now();
    action.executed = false;
    action.cancelled = false;
    return db.insertOne(collection, action);
}

export async function update(action: Action & Entity) {
    action.updatedAt = Date.now();
    return db.updateOne(collection, {
        group: action.group,
        id: action.id,
    }, action);
}