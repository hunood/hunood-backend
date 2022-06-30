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
    exposedHeaders: ['Authorization', 'Refresh-Authorization'],
    origin: "https://hunood-web-psi.vercel.app"
}));

app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    req.body = Util.recursiveObjectTo(req.body, Util.camelToSnakeCase);
    next()
})

app.use(router);

app.listen(config.port);