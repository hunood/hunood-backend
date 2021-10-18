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
    CEPController,
    AssociadoController
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
router.get(BaseRoute.authentication + '/exists/:id_or_email', [autenticacao.bearer], AutenticacaoController.exists);
router.post(BaseRoute.authentication + '/update-email', [autenticacao.bearer], AutenticacaoController.updateEmail);
router.post(BaseRoute.authentication + '/send-code', [autenticacao.bearer], AutenticacaoController.sendEmailCode);
router.post(BaseRoute.authentication + '/verification-code', [autenticacao.bearer], AutenticacaoController.verificationEmailCode);

// Business
router.post(BaseRoute.business + '/find', [autenticacao.bearer], EmpresaController.find);
router.post(BaseRoute.business + '/find-by-user/', [autenticacao.bearer], EmpresaController.findByUser);

// Onboarding
router.post(BaseRoute.onboarding + '/user', [autenticacao.bearer], OnboardingController.user);
router.post(BaseRoute.onboarding + '/business', [autenticacao.bearer], OnboardingController.business);
router.post(BaseRoute.onboarding + '/send-code', [autenticacao.bearer], OnboardingController.sendCode);
router.post(BaseRoute.onboarding + '/verification-code', [autenticacao.bearer], OnboardingController.verificationCode);

// User
router.post(BaseRoute.user + '/create', [autenticacao.bearer], UsuarioController.create);
router.post(BaseRoute.user + '/create-and-associate', [autenticacao.bearer], UsuarioController.createAndAssociate);
router.post(BaseRoute.user + '/find', [autenticacao.bearer], UsuarioController.find);
router.post(BaseRoute.user + '/find-by-business', [autenticacao.bearer], UsuarioController.findByBusiness);
router.post(BaseRoute.user + '/find/verify-association', [autenticacao.bearer], UsuarioController.verifyAssociation);

// Association
router.post(BaseRoute.association + '/update', [autenticacao.bearer], AssociadoController.update);

// CEP
router.get(BaseRoute.cep + '/find/:cep', [autenticacao.bearer], CEPController.find);

export { router }