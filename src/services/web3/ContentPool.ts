import { ethers } from 'ethers';
import logger from '../../utils/logger';
import * as contents from '../db/contents';

export async function onContentAdded(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const contentId = event.topics[2];
        const tag = event.topics[3];
        await contents.add({
            group,
            id: Number(contentId),
            tag: Number(tag),
        });
        logger.info(`Content with id '${contentId}' added`);
    }
}

export async function onContentLocked(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const contentId = event.topics[2];
        await contents.update({
            group,
            id: Number(contentId),
            locked: true,
        });
        logger.info(`Content with id '${contentId}' locked`);
    }
}

export async function onContentUnlocked(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const contentId = event.topics[2];
        await contents.update({
            group,
            id: Number(contentId),
            locked: false,
        });
        logger.info(`Content with id '${contentId}' unlocked`);
    }
}

export async function onBatchAdded(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const batchId = event.topics[2];
        const contentId = event.topics[3];
        await contents.update({
            group,
            id: Number(contentId),
            batch: Number(batchId),
        });
        logger.info(`Batch with id '${batchId}' added`);
    }
}

export async function onBatchLocked(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const batchId = event.topics[2];
        const contentId = event.topics[3];
        await contents.update({
            group,
            id: Number(contentId),
            locked: true,
        });
        logger.info(`Batch with id '${batchId}' locked`);
    }
}

export async function onBatchUnlocked(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const batchId = event.topics[2];
        const contentId = event.topics[3];
        await contents.update({
            group,
            id: Number(contentId),
            locked: false,
        });
        logger.info(`Batch with id '${batchId}' unlocked`);
    }
}