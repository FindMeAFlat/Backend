import { Router } from 'express';

import getBestStops from './../services/stations';

const stationsRouter = Router();
stationsRouter.post('/', async (req, res, next) => {
    res.send(await getBestStops(req));
});

export default stationsRouter;
