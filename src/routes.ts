import { Router } from 'express';
// import { connection } from './database/index';

import { UserController } from './controllers/UserController';

const router = Router();

// router.get('/', (req, res) => {
//     connection.authenticate();
//     return res.json({ hello: 'World' });
// });

router.post('/users', UserController.store);

// export default router;
export { router as routes }