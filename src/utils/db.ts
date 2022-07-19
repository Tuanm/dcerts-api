import { MongoClient } from 'mongodb';

export class DB {
    private client: MongoClient | undefined;

    /**
     * Connects to MongoDB using its connection string.
     * @param url the connection string
     */
    async connect(url: string) {
        this.client = await MongoClient.connect(url);
    }

    private collection(name: string) {
        return this.client?.db().collection(name);
    }

    async distinct(collection: string, field: string, query: Object) {
        return this.collection(collection)?.distinct(field, query);
    }

    async search(collection: string, query: Object, sort?: any, limit?: number) {
        let cursor = this.collection(collection)?.find(query);
        if (sort) cursor = cursor?.sort(sort);
        if (limit) cursor = cursor?.limit(limit);
        return cursor?.toArray();
    }

    async insertOne(collection: string, entity: any) {
        return this.collection(collection)?.insertOne(entity);
    }

    async insertMany(collection: string, entities: any[]) {
        return this.collection(collection)?.insertMany(entities);
    }

    async updateOne(collection: string, query: Object, update: any) {
        return this.collection(collection)?.updateOne(query, { $set: update });
    }

    async updateMany(collection: string, query: Object, update: any) {
        return this.collection(collection)?.updateMany(query, { $set: update });
    }
}