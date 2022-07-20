import { db } from '.';
import { Entity } from './entities/entity';
import { Group } from './entities/group';

const collection = 'groups';

type GroupEntity = Group & Entity;

export async function ids() {
    return await db.distinct(collection, 'id', {}) || [] as string[];
}

export async function add(group: GroupEntity) {
    group.createdAt = Date.now();
    return db.insertOne(collection, group);
}

export async function groupsOfMember(member: string) {
    return await db.distinct(collection, 'id', { member }) || [] as string[];
}

export async function membersOfGroup(group: string) {
    return await db.distinct(collection, 'member', { id: group }) || [] as string[];
}