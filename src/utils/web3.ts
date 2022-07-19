import { ethers } from 'ethers';
import { configuration } from '.';

/**
 * Returns the Web3 provider.
 */
export function getProvider() {
    return new ethers.providers.JsonRpcProvider({
        url: configuration()?.web3.provider.url,
    });
}

/**
 * Retrieves a contract's instance by its name.
 */
export function getContract(address: string, contractName: string, signer: ethers.providers.JsonRpcSigner) {
    const { abi } = require(`../contracts/${contractName}.json`);
    if (abi) {
        const contractInterface = new ethers.utils.Interface(abi);
        return new ethers.Contract(address, contractInterface, signer);
    }
    throw new Error('Contract not found');
}

/**
 * Returns a specific filter for smart contract.
 */
export function getFilter(
    contract: ethers.Contract,
    eventName: string,
    topics: any[],
) {
    return contract.filters[eventName](...topics);
}

/**
 * Listens to a specific event from a smart contract.
 */
export function listenToEvent(
    address: string,
    contractName: string,
    eventName: string,
    topics: any[],
    handler: (...args: any[]) => any,
) {
    const provider = getProvider();
    const contract = getContract(address, contractName, provider.getSigner());
    const filter = getFilter(contract, eventName, topics);
    return contract.on(filter, handler);
}

/**
 * Retrieves the event logs of a smart contract.
 */
export async function getLogs(
    address: string,
    contractName: string,
    eventName: string,
    topics: any[],
    fromBlock?: number,
    toBlock?: number,
) {
    const provider = getProvider();
    const contract = getContract(address, contractName, provider.getSigner());
    const filter = getFilter(contract, eventName, topics);
    return contract.queryFilter(filter, fromBlock, toBlock);
}