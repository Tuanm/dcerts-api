import { Configuration } from '../config';

let config: Configuration;

/**
 * Configures utilities.
 */
export function configure(configuration: Configuration) {
    config = configuration;
}

/**
 * Returns utilities' configurations.
 */
export function configuration() {
    return config;
}