import express from 'express';
import chalk from 'chalk';
import { config } from './config';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(router);
app.listen(config.port);

console.log(chalk.green('BACKEND STARTED'), `on port: ${config.port}`);