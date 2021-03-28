import redis  from 'redis';
import { config } from '../../config';
import manipulaLista from './index';

const options = Object.assign(config.redis, { prefix: 'allowlist-refresh-token:' });
const allowlist = redis.createClient(options);

export const allowlistRefreshToken = manipulaLista(allowlist);