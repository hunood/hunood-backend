import { RedisClient } from 'redis';
import { promisify } from 'util';

const Redis = (client: RedisClient) => {
  const setAsync = promisify(client.set).bind(client);
  const existsAsync = promisify(client.exists).bind(client);
  const getAsync = promisify(client.get).bind(client);
  const delAsync = promisify(client.del).bind(client);

  return {
    async adiciona(chave: string, valor: string, dataExpiracao: number) {
      await setAsync(chave, valor);
      client.expireat(chave, dataExpiracao);
    },

    async buscaValor(chave: string) {
      return await getAsync(chave);
    },

    async contemChave(chave: string) {
      const resultado = await existsAsync(chave);
      return resultado === 1;
    },

    async deleta(chave: string) {
      await delAsync(chave);
    }
  };
};

export type RedisList = ReturnType<typeof Redis>
export default Redis as (client: RedisClient) => RedisList;
