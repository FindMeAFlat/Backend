import { Router, Request, Response } from 'express';
import { Repositories } from '../db';

function getCities(req: Request, res: Response): void {
    Repositories.City.where({}).then((result) => {
        const data = result.map((city) => city.name);
        const status = res.statusCode;
        res.json({
            status,
            data
        });
    });
}

const citiesRouter = Router();
citiesRouter.get('/', getCities);

export default citiesRouter;
