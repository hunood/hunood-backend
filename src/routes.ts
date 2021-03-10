import { Router } from 'express';
import { BaseRoute } from './typing/enums';
import { status, verifyJWT } from './assets/status-codes';
import { routerDev } from './assets/router-dev';

import {
    AutenticacaoController,
    EmpresaController,
    OnboardingController,
    UsuarioController,
    CEPController
} from './controllers'

const router = Router();

router.use(status);
router.use(routerDev);

// Authentication
router.post(BaseRoute.authentication, AutenticacaoController.authenticate);
router.post(BaseRoute.authentication + '/create', AutenticacaoController.create);
router.post(BaseRoute.authentication + '/find', AutenticacaoController.find);

// Business
router.post(BaseRoute.business + '/find', verifyJWT, EmpresaController.find);

// Onboarding
router.post(BaseRoute.onboarding + '/user', OnboardingController.user);
router.post(BaseRoute.onboarding + '/business', OnboardingController.business);

// User
router.post(BaseRoute.user + '/create', UsuarioController.create);
router.post(BaseRoute.user + '/find', UsuarioController.find);

// CEP
router.get(BaseRoute.cep + '/find/:cep', CEPController.find);

export { router }