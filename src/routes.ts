import { Router } from 'express';
import { BaseRoute } from './typing/enums';
import { status } from './assets/status-codes';
import { routerDev } from './assets/router-dev';

import { AutenticacaoController } from './controllers/Autenticacao.controller';

const router = Router();

router.use(status);
router.use(routerDev);

router.post(BaseRoute.authentication, AutenticacaoController.authenticate);
router.post(BaseRoute.authentication + '/create', AutenticacaoController.create);
router.post(BaseRoute.authentication + '/find', AutenticacaoController.find);

export { router }