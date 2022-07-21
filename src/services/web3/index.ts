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
    if (fromBlock + 1 < toBlock) {
        const poolId = process.env.WEB3_CONTENT_POOL_ADDRESS;
        for (const id of await groups.ids()) {
            logger.info(`Fetching logs for group ${id}`);
            onVotingStarted(id, await getLogs(id, 'BallotWallet', 'VotingStarted', [], fromBlock, toBlock));
            onVoted(id, await getLogs(id, 'BallotWallet', 'Voted', [], fromBlock, toBlock));
            onActionExecuted(id, await getLogs(id, 'BallotWallet', 'ActionExecuted', [], fromBlock, toBlock));
            onActionCancelled(id, await getLogs(id, 'BallotWallet', 'ActionCancelled', [], fromBlock, toBlock));
            if (poolId) {
                onContentAdded(await getLogs(poolId, 'ContentPool', 'ContentAdded', [id], fromBlock, toBlock));
                onContentLocked(await getLogs(poolId, 'ContentPool', 'ContentLocked', [id], fromBlock, toBlock));
                onContentUnlocked(await getLogs(poolId, 'ContentPool', 'ContentUnlocked', [id], fromBlock, toBlock));
            }
            logger.info(`Fetched logs for group ${id}`);
        }
        await settings.update({
            key,
            value: toBlock,
        });
        logger.info(`Updated ${key} to ${toBlock}`);
    }
}