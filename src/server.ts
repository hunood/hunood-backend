import express from 'express';
import helmet from 'helmet';
import { config } from './config';
import { router } from './routes';
import { validarInicializacoes } from './assets/validador-inicializacao';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(router);
app.listen(config.port);

validarInicializacoes()