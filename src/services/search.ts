import { db } from './db';
import { groupsOfMember } from './db/groups';

export async function search(accountId: string, collection: string, query: any = {}) {
    const groups = await groupsOfMember(accountId);
    query.group = { $in: groups };
    return db.search(collection, query);
}