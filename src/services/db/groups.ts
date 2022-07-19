import { db } from '.';
import { Entity } from './entities/entity';
import { Group } from './entities/group';

const collection = 'groups';

type GroupEntity = Group & Entity;

export async function ids() {
    return await db.distinct(collection, 'id', {}) || [];
}

export async function add(group: GroupEntity) {
    group.createdAt = Date.now();
    return db.insertOne(collection, group);
}

export async function groupsOfMember(member: string) {
    return db.search(collection, { member });
}

export async function membersOfGroup(group: string) {
    return await db.search(collection, { id: group }) || [];
}