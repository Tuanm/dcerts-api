"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = void 0;
var dotenv_1 = require("dotenv");
var ContentPool_json_1 = __importDefault(require("./contracts/ContentPool.json"));
/**
 * Configures stuff.
 */
function configure() {
    (0, dotenv_1.config)();
    return {
        web3: {
            provider: {
                url: process.env.WEB3_URL || '',
            },
            contract: {
                contentPool: {
                    address: process.env.CONTENT_POOL_ADDRESS || '',
                    abi: ContentPool_json_1.default.abi,
                },
            },
        },
    };
}
exports.configure = configure;
