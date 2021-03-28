import redis from 'redis';
import jwt from 'jsonwebtoken';
import manipulaLista from './index';
import{ createHash } from 'crypto';
import { config } from '../../config';

const options = Object.assign(config.redis, { prefix: 'blocklist-access-token:' });
const blocklist = redis.createClient(options);
const manipulaBlocklist = manipulaLista(blocklist);

const geraTokenHash = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
}

export const blocklistAccessToken = {
  async adiciona(token: string) {
    const dataExpiracao = (jwt.decode(token) as any).exp;
    const tokenHash = geraTokenHash(token);
    await manipulaBlocklist.adiciona(tokenHash, '', dataExpiracao);
  },
  async contemToken(token: string) {
    const tokenHash = geraTokenHash(token);
    return manipulaBlocklist.contemChave(tokenHash);
  },
};
