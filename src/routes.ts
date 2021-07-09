import { Router } from 'express';
import { BaseRoute } from './typing/enums';
import { status } from './assets/status-codes';
import { routerDev } from './assets/router-dev';
import { appVersion } from './assets/html/appVersion';
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

// Hunood
router.get(BaseRoute.version, (_, res) => res.send(appVersion()));

// Authentication
router.post(BaseRoute.authentication, AutenticacaoController.authenticate);
router.post(BaseRoute.authentication + '/forbid', AutenticacaoController.forbid);
router.post(BaseRoute.authentication + '/create', AutenticacaoController.create);
router.post(BaseRoute.authentication + '/refresh', [autenticacao.refresh], AutenticacaoController.refresh);
router.get(BaseRoute.authentication + '/find/:idOrEmail', [autenticacao.bearer], AutenticacaoController.find);
router.post(BaseRoute.authentication + '/update-email', [autenticacao.bearer], AutenticacaoController.updateEmail);
router.post(BaseRoute.authentication + '/send-code', [autenticacao.bearer], AutenticacaoController.sendEmailCode);
router.post(BaseRoute.authentication + '/verification-code', [autenticacao.bearer], AutenticacaoController.verificationEmailCode);

// Business
router.post(BaseRoute.business + '/find', EmpresaController.find);

// Onboarding
router.post(BaseRoute.onboarding + '/user', [autenticacao.bearer], OnboardingController.user);
router.post(BaseRoute.onboarding + '/business', [autenticacao.bearer], OnboardingController.business);
router.post(BaseRoute.onboarding + '/send-code', [autenticacao.bearer], OnboardingController.sendCode);
router.post(BaseRoute.onboarding + '/verification-code', [autenticacao.bearer], OnboardingController.verificationCode);

// User
router.post(BaseRoute.user + '/create', [autenticacao.bearer], UsuarioController.create);
router.get(BaseRoute.user + '/find/:idOrCpf', [autenticacao.bearer], UsuarioController.find);

// CEP
router.get(BaseRoute.cep + '/find/:cep', [autenticacao.bearer], CEPController.find);

export { router }