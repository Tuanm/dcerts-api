import { configure } from './config';
import * as utils from './utils';
import logger from './utils/logger';
import { db } from './services/db';

const config = configure();
utils.configure(config);
(() => {
    db.connect(config.db.url).then(() => {
        logger.info('Database connected');
    }).catch((err) => {
        logger.error(err?.message);
    });
})();

import express, { Express } from 'express';
import cors from 'cors';

import auth from './routes/auth';
import search from './routes/search';
import { filterJwt } from './services/auth';
import { handleError, handleNotFound } from './services/error';
import { fetchLogs } from './services/web3';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/search', filterJwt, search);
app.use(handleError);
app.use(handleNotFound);

const port = config.app.port;

app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
});

setInterval(async () => {
    fetchLogs().catch((err) => {
        logger.error(err?.message);
    });
}, config.web3.fetchInterval);