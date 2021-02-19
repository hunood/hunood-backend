import {Request, Response, NextFunction} from 'express'

const routerDev = (req: Request, _: Response, next: NextFunction) => {
    if (process.env.ENVIRONMENT !== 'production') {
        console.log('\nOriginal Url:', req.originalUrl);
        console.log('Request Body:', req.body);
    }
    next();
}

export { routerDev };