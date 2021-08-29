import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { router } from './routes';
import { validarInicializacoes } from './assets/validador-inicializacao'; 
import { Util } from './assets/utils';

const app = express();

validarInicializacoes();

app.use(cors({
    exposedHeaders: ['Authorization', 'Refresh-Authorization']
}));

app.use(helmet());
app.use(express.json());

app.use((req, _, next) => {
    req.body = Util.recursiveObjectTo(req.body, Util.camelToSnakeCase);
    next()
})

app.use(router);

app.listen(config.port);