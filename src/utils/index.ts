import { Configuration } from '../config';
import { Error } from '../services/error';

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
    if (!config) throw Error.of(500, 'Application not configured');
    return config;
}