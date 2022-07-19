import { create } from 'ipfs-http-client';
import { configuration } from '.';

export default create(configuration()?.ipfs);