import client, { RedisClient }  from 'redis';

import { config } from '../config';

class Redis {
    private static instance: RedisClient;

    public static getInstance(): RedisClient {
        if (!Redis.instance) {
            Redis.instance = client.createClient(config.redis);
        }

        return Redis.instance;
    }
}

export const redis = Redis.getInstance();