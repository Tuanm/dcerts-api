import logger from '../utils/logger';
import { db } from './db';
import { groupsOfMember } from './db/groups';

export async function search(accountId: string, collection: string, query: {
    page?: number,
    limit?: number,
    [key: string]: any,
} = {}) {
    const groups = await groupsOfMember(accountId);
    if (collection === 'actions') {
        query = validateActionQuery(query);
    } else if (collection === 'contents') {
        query = validateContentQuery(query);
    } else {
        return Promise.resolve([]);
    }
    if (!query.group) {
        query.group = { $in: groups };
    }
    logger.info(`Query: ${JSON.stringify(query)}`);
    const page = Number(query.page);
    const limit = Number(query.limit);
    delete query.page;
    delete query.limit;
    return db.search(collection, query, { id: -1 }, page, limit);
}

function validateContentQuery(query: any = {}) {
    if (query.locked === 'true') {
        query.locked = true;
    } else if (query.locked === 'false') {
        query.locked = false;
    }
    if (query.id !== undefined) {
        query.id = Number(query.id);
    }
    return query;
}

function validateActionQuery(query: any = {}) {
    if (query.executed === 'true') {
        query.executed = true;
    } else if (query.executed === 'false') {
        query.executed = false;
    }
    if (query.cancelled === 'true') {
        query.cancelled = true;
    } else if (query.cancelled === 'false') {
        query.cancelled = false;
    }
    if (query.id !== undefined) {
        query.id = Number(query.id);
    }
    return query;
}