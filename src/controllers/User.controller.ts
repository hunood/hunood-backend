const { v4: uuidv4 } = require('uuid');
import { User } from '../models';

const UserController = {
    async index(_, res) {
        const users = await User.findAll();

        return res.json(users);
    },

    async store(req, res) {
        console.log('REQ: ', req.body, 'UUID: ', uuidv4());
        const { name, email } = req.body;


        const user = await User.create({ id: uuidv4(), name, email });

        return res.json(user);
    }
};

export { UserController };