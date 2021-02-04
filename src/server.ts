import express from 'express';
import chalk from 'chalk';
import { config } from './config';
import { routes } from './routes';
import { Connection } from './database/';

const app = express();
new Connection();

app.use(express.json());
app.use(routes);
app.listen(config.port);

console.log(chalk.green('BACKEND STARTED'), `on port: ${config.port}`);