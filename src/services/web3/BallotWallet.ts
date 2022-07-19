import { ethers } from 'ethers';
import * as actions from '../db/actions';
import * as votes from '../db/votes';

export async function onVotingStarted(events: ethers.Event[]) {
    for (const event of events) {
        const address = event.topics[0];
        const actionId = event.topics[1];
        const starter = event.topics[2];
        await actions.add({
            group: address,
            id: Number(actionId),
            starter: starter,
        });
    }
}

export async function onVoted(events: ethers.Event[]) {
    for (const event of events) {
        const address = event.topics[0];
        const actionId = event.topics[1];
        const voter = event.topics[2];
        await votes.add({
            group: address,
            action: Number(actionId),
            voter: voter,
        });
    }
}

export async function onActionExecuted(events: ethers.Event[]) {
    for (const event of events) {
        const address = event.topics[0];
        const actionId = event.topics[1];
        await actions.update({
            group: address,
            id: Number(actionId),
            executed: true,
        });
    }
}

export async function onActionCancelled(events: ethers.Event[]) {
    for (const event of events) {
        const address = event.topics[0];
        const actionId = event.topics[1];
        await actions.update({
            group: address,
            id: Number(actionId),
            cancelled: true,
        });
    }
}