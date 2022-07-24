import { config } from 'dotenv';
import ContentPool from './contracts/ContentPool.json';
import BallotWallet from './contracts/BallotWallet.json';

export interface Configuration {
    /**
     * Contains the configurations of the application.
     */
    app: {
        /**
         * Application port.
         */
        port: string | number,
        auth: {
            secret: string,
            validity: string,
        },
    },
    /**
     * Contains database configurations.
     */
    db: {
        /**
         * The URL.
         */
        url: string,
    },
    ipfs: {
        host: string,
        port: number,
        headers: {
            authorization: string | undefined,
        },
    },
    /**
     * Contains the Web3 configurations.
     */
    web3: {
        /**
         * The interval for automatically fetching logs from the network.
         */
        fetchInterval: number,
        /**
         * Provider.
         */
        provider: {
            /**
             * The URL.
             */
            url: string,
        },
        /**
         * Contains the smart contracts' information.
         */
        contract: {
            /**
             * Name of the smart contract.
             */
            [key: string]: {
                /**
                 * The address of the smart contract in network.
                 */
                address?: string,
                /**
                 * The ABI of the smart contract.
                 */
                abi: string[],
            },
        },
    },
}

/**
 * Configures stuff.
 */
export function configure() {
    if (!process.env.PRODUCTION) config();
    return {
        app: {
            port: process.env.PORT || 8080,
            auth: {
                secret: process.env.AUTH_SECRET || '',
                validity: process.env.AUTH_VALIDITY || '',
            },
        },
        db: {
            url: process.env.DB_URL || '',
        },
        ipfs: {
            host: process.env.IPFS_HOST || '',
            port: Number(process.env.IPFS_PORT),
            headers: {
                authorization: process.env.IPFS_AUTHORIZATION,
            },
        },
        web3: {
            fetchInterval: Number(process.env.WEB3_FETCH_INTERVAL) || 60000,
            provider: {
                url: process.env.WEB3_URL || '',
            },
            contract: {
                contentPool: {
                    address: process.env.WEB3_CONTENT_POOL_ADDRESS || '',
                    abi: ContentPool.abi,
                },
                ballotWallet: {
                    abi: BallotWallet.abi,
                }
            },
        },
    };
}