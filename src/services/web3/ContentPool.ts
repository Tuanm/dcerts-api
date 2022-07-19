import { ethers } from 'ethers';
import * as contents from '../db/contents';

export async function onContentAdded(events: ethers.Event[]) {
    for (const event of events) {
        const author = event.topics[1];
        const contentId = event.topics[2];
        const cid = event.topics[3];
        await contents.add({
            group: author,
            id: Number(contentId),
            cid,
        });
    }
}

export async function onContentLocked(events: ethers.Event[]) {
    for (const event of events) {
        const author = event.topics[1];
        const contentId = event.topics[2];
        await contents.update({
            group: author,
            id: Number(contentId),
            locked: true,
        });
    }
}

export async function onContentUnlocked(events: ethers.Event[]) {
    for (const event of events) {
        const author = event.topics[1];
        const contentId = event.topics[2];
        await contents.update({
            group: author,
            id: Number(contentId),
            locked: false,
        });
    }
}