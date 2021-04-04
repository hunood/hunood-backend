import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import moment from 'moment';
import { config } from '../../config';

import { allowlistRefreshToken } from '../redis-manager/allowlist-refresh-token';
import { blocklistAccessToken } from '../redis-manager/blocklist-access-token';
import { allowlistEmailToken } from '../redis-manager/allowlist-email-token';

function criaTokenJWT(id: string, [tempoQuantidade, tempoUnidade]) {
  const payload = { id };
  const token = jwt.sign(payload, config.auth.password, {
    expiresIn: tempoQuantidade + tempoUnidade,
  });
  return token;
}

async function verificaTokenJWT(token: string, nome: string, blocklist: typeof blocklistAccessToken): Promise<any> {
  if (!token) {
    return new jwt.JsonWebTokenError(`${nome} não enviado!`, new Error('TKAU1001'));
  }

  const hasBlockList = await verificaTokenNaBlocklist(token, nome, blocklist);

  if (hasBlockList) {
    return hasBlockList;
  }

  return jwt.verify(token, config.auth.password, function (err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return new jwt.JsonWebTokenError(`${nome} expirado.`, new Error('TKAU1002'));
      }
      return new jwt.JsonWebTokenError(`${nome} inválido.`, new Error('TKAU1003'));
    }

    return (decoded as any).id;
  });
}

async function verificaTokenNaBlocklist(token: string, nome: string, blocklist: typeof blocklistAccessToken) {
  const tokenNaBlocklist = await blocklist.contemToken(token);
  if (tokenNaBlocklist) {
    return new jwt.JsonWebTokenError(`${nome} bloqueado.`, new Error('TKAU1004'));
  }
}

function invalidaTokenJWT(token: string, blocklist: typeof blocklistAccessToken) {
  return blocklist.adiciona(token);
}

async function criaTokenOpaco(id: string, [tempoQuantidade, tempoUnidade], allowlist: typeof allowlistRefreshToken) {
  const tokenOpaco = crypto.randomBytes(24).toString('hex');
  const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix();
  await allowlist.adiciona(tokenOpaco, id, dataExpiracao);
  return tokenOpaco;
}

async function verificaTokenOpaco(token: string, nome: string, allowlist: typeof allowlistRefreshToken) {
  if (!token) {
    return new jwt.JsonWebTokenError(`${nome} não enviado!`, new Error('TKOP1001'));
  }

  const id = await allowlist.buscaValor(token);

  if (!id) {
    return new jwt.JsonWebTokenError(`${nome} inválido!`, new Error('TKOP1002'));
  }

  return id;
}

async function invalidaTokenOpaco(token: string, allowlist: typeof allowlistRefreshToken) {
  await allowlist.deleta(token);
}

async function criaTokenEmail(id: string, [tempoQuantidade, tempoUnidade], allowlist: typeof allowlistRefreshToken) {
  const tokenEmail = crypto.randomInt(100001, 999999).toString();
  const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix();
  await allowlist.deleta(id);
  await allowlist.adiciona(id, tokenEmail, dataExpiracao);
  return tokenEmail;
}

async function verificaTokenEmail(id: string, token: string, allowlist: typeof allowlistRefreshToken) {
  const code = await allowlist.buscaValor(id);
  return code === token;
}

async function invalidaTokenEmail(id: string, allowlist: typeof allowlistRefreshToken) {
  await allowlist.deleta(id);
}

export default {
  access: {
    nome: 'Access token',
    expiracao: [25, 'minutes'],
    lista: blocklistAccessToken,
    cria(id: string) {
      return criaTokenJWT(id, this.expiracao);
    },
    async verifica(token: string) {
      return verificaTokenJWT(token, this.nome, this.lista);
    },
    async invalida(token: string) {
      return invalidaTokenJWT(token, this.lista);
    }
  },
  refresh: {
    nome: 'Refresh token',
    expiracao: [4, 'hours'],
    lista: allowlistRefreshToken,
    async cria(id: string) {
      return criaTokenOpaco(id, this.expiracao, this.lista);
    },
    async verifica(token: string) {
      return verificaTokenOpaco(token, this.nome, this.lista);
    },
    async invalida(token: string) {
      return invalidaTokenOpaco(token, this.lista);
    }
  },
  email: {
    nome: 'Email token',
    expiracao: [1, 'h'],
    lista: allowlistEmailToken,
    async cria(id: string) {
      return criaTokenEmail(id, this.expiracao, this.lista);
    },
    async verifica(id: string, token: string) {
      return verificaTokenEmail(id, token, this.lista);
    },
    async invalida(id: string) {
      return invalidaTokenEmail(id, this.lista);
    }
  }
};
