import { isConnected } from '../database';
import { config } from '../config';
import { t } from '../i18n';
import { createClient } from 'redis';
import chalk from 'chalk';


export const validarInicializacoes = async () => {
    const redis = createClient(config.redis);

    redis.on('connect', async () => {
        try {
            if (await isConnected) {
                console.log(chalk.green(t('messages:redis-inicializado')), t('messages:na-porta', { porta: config.redis.port }));
                console.log(chalk.green(t('messages:banco-inicializado')), t('messages:na-porta', { porta: config.database.port }));
                console.log(chalk.green(t('messages:api-inicializada')), chalk.blueBright(`- ${config.baseUrl}`));
            }
        }
        catch (erro) {
            console.log(chalk.red(t('messages:banco-nao-inicializado', { erro })));
            console.log(chalk.red(t('messages:api-nao-inicializada')));
        };
    });

    redis.on('error', () => {
        console.log(chalk.red(t('messages:redis-nao-inicializado')));
    });
}