import { db } from '.';
import logger from '../../utils/logger';
import { Entity } from './entities/entity';
import { Setting } from './entities/setting';

const collection = 'settings';

type SettingEntity = Setting & Entity;

export async function valueOfKey(key: string) {
    const result = (await db.search(collection, { key }, null, 1)).data || [] as SettingEntity[];
    return result[0]?.value || null;
}

export async function add(setting: SettingEntity) {
    try {
        setting.createdAt = Date.now();
        const result = await db.insertOne(collection, setting);
        return result;
    } catch (err: any) {
        logger.error(err?.message)
    }
}

export async function update(setting: SettingEntity) {
    setting.updatedAt = Date.now();
    return db.updateOne(collection, {
        key: setting.key,
    }, setting);
}