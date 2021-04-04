import { Router } from 'express';
import { BaseRoute } from './typing/enums';
import { status } from './assets/status-codes';
import { routerDev } from './assets/router-dev';
import autenticacao from './assets/token-authentication/middlewares-autenticacao';

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
router.post(BaseRoute.authentication + '/forbid', AutenticacaoController.forbid);
router.post(BaseRoute.authentication + '/create', AutenticacaoController.create);
router.post(BaseRoute.authentication + '/refresh', autenticacao.refresh, AutenticacaoController.refresh);
router.post(BaseRoute.authentication + '/find', [autenticacao.bearer], AutenticacaoController.find);
router.post(BaseRoute.authentication + '/sendcode', [autenticacao.bearer], AutenticacaoController.sendEmailCode);
router.post(BaseRoute.authentication + '/verificationcode', AutenticacaoController.verificationEmailCode);

// Business
router.post(BaseRoute.business + '/find', EmpresaController.find);

// Onboarding
router.post(BaseRoute.onboarding + '/user', [autenticacao.bearer], OnboardingController.user);
router.post(BaseRoute.onboarding + '/business', [autenticacao.bearer], OnboardingController.business);
router.post(BaseRoute.onboarding + '/sendCode', [autenticacao.bearer], OnboardingController.sendCode);
router.post(BaseRoute.onboarding + '/verificationCode', [autenticacao.bearer], OnboardingController.verificationCode);

// User
router.post(BaseRoute.user + '/create', UsuarioController.create);
router.post(BaseRoute.user + '/find', UsuarioController.find);

// CEP
router.get(BaseRoute.cep + '/find/:cep', [autenticacao.bearer], CEPController.find);

export { router }