import { Router } from 'express';
import { BaseRoute } from './typing/enums';
import { status } from './assets/status-codes';
import { routerDev } from './assets/router-dev';

import { AutenticacaoController } from './controllers/Autenticacao.controller';
import { UsuarioController } from './controllers/Usuario.controller';

const router = Router();

router.use(status);
router.use(routerDev);

// Authentication
router.post(BaseRoute.authentication, AutenticacaoController.authenticate);
router.post(BaseRoute.authentication + '/create', AutenticacaoController.create);
router.post(BaseRoute.authentication + '/find', AutenticacaoController.find);

// User
router.post(BaseRoute.user + '/create', UsuarioController.create);
router.post(BaseRoute.user + '/find', UsuarioController.find);

export { router }