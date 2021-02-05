import { Router } from 'express';
import { UserController } from './controllers';

const router = Router();

router.get('/', (_, res) => {
    return res.json({ hello: 'World' });
});

router.post('/users', UserController.store);

export { router }