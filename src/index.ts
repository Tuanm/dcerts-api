import { configure } from './config';
import * as utils from './utils';
import { db } from './services/db';

const config = configure();
(async () => {
    utils.configure(config);
    await db.connect(config.db.url);
})();

import express, { Express } from 'express';
import cors from 'cors';

import auth from './routes/auth';
import search from './routes/search';
import { filterJwt } from './services/auth';
import { fetchLogs } from './services/web3';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/auth', auth);
app.use('/search', search);

const port = config.app.port;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

setInterval(async () => {
    await fetchLogs();
}, 10000);