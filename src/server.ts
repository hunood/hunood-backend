import express from 'express';
import chalk from 'chalk';
import { config } from './config';
import { router } from './routes';
import { t } from './i18n';

const app = express();

app.use(express.json());
app.use(router);
app.listen(config.port);

console.log(chalk.green(t('messages:api-inicializada')), t('messages:na-porta', { porta: config.port }));