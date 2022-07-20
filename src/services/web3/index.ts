import logger from '../../utils/logger';
import { getLogs, getProvider } from '../../utils/web3';
import * as groups from '../db/groups';
import * as settings from '../db/settings';
import { onActionCancelled, onActionExecuted, onVoted, onVotingStarted } from './BallotWallet';
import { onContentAdded, onContentLocked, onContentUnlocked } from './ContentPool';

export async function fetchLogs() {
    const key = 'LATEST_BLOCK';
    const provider = getProvider();
    const toBlock = await provider.getBlockNumber();
    let fromBlock = await settings.valueOfKey(key);
    if (fromBlock === null) {
        fromBlock = 0;
        await settings.add({
            key,
            value: fromBlock,
        });
    }
    if (fromBlock < toBlock) {
        for (const id of await groups.ids()) {
            logger.info(`Fetching logs for group ${id}`);
            onVotingStarted(await getLogs(id, 'BallotWallet', 'VotingStarted', [], fromBlock, toBlock));
            onVoted(await getLogs(id, 'BallotWallet', 'Voted', [], fromBlock, toBlock));
            onActionExecuted(await getLogs(id, 'BallotWallet', 'ActionExecuted', [], fromBlock, toBlock));
            onActionCancelled(await getLogs(id, 'BallotWallet', 'ActionCancelled', [], fromBlock, toBlock));
            onContentAdded(await getLogs(id, 'ContentPool', 'ContentAdded', [id], fromBlock, toBlock));
            onContentLocked(await getLogs(id, 'ContentPool', 'ContentLocked', [id], fromBlock, toBlock));
            onContentUnlocked(await getLogs(id, 'ContentPool', 'ContentUnlocked', [id], fromBlock, toBlock));
            logger.info(`Fetched logs for group ${id}`);
        }
        await settings.update({
            key,
            value: toBlock,
        });
        logger.info(`Updated ${key} to ${toBlock}`);
    }
}