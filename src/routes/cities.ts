import { Router, Request, Response } from 'express';
import { Repositories } from '../db';

class CityRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetCities(req: Request, res: Response): void {
        let data = [];
        Repositories.City.where({}).then((result) => {
             for(let city of result){
                 data.push(city.name);
             }
             const status = res.statusCode;
             res.json({
                 status,
                 data
             });
        });
    }

    routes() {
        this.router.get('/', this.GetCities);
    }
}

const citiesRoutes = new CityRouter();
citiesRoutes.routes();

export default citiesRoutes.router;