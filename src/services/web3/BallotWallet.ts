import { ethers } from 'ethers';
import * as actions from '../db/actions';
import * as votes from '../db/votes';

export async function onVotingStarted(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const actionId = event.topics[1];
        const starter = event.topics[2];
        await actions.add({
            group,
            id: Number(actionId),
            starter: starter,
        });
    }
}

export async function onVoted(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const actionId = event.topics[1];
        const voter = event.topics[2];
        await votes.add({
            group,
            action: Number(actionId),
            voter: voter,
        });
    }
}

export async function onActionExecuted(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const actionId = event.topics[1];
        await actions.update({
            group,
            id: Number(actionId),
            executed: true,
        });
    }
}

export async function onActionCancelled(group: string, events: ethers.Event[]) {
    for (const event of events) {
        const actionId = event.topics[1];
        await actions.update({
            group,
            id: Number(actionId),
            cancelled: true,
        });
    }
}