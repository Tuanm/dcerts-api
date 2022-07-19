import { db } from '.';
import { Entity } from './entities/entity';
import { Setting } from './entities/setting';

const collection = 'settings';

type SettingEntity = Setting & Entity;

export async function valueOfKey(key: string) {
    const result = await db.search(collection, { key }, null, 1) || [] as SettingEntity[];
    return result[0]?.value || null;
}

export async function add(setting: SettingEntity) {
    setting.createdAt = Date.now();
    return db.insertOne(collection, setting);
}

export async function update(setting: SettingEntity) {
    setting.updatedAt = Date.now();
    return db.updateOne(collection, {
        key: setting.key,
    }, setting);
}