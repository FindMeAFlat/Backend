import { Router } from 'express';

import getNearestRoads from './../services/roads';

const roadsRouter = Router();
roadsRouter.post('/', async (req, res, next) => {
       res.send(await getNearestRoads(req));
});

export default roadsRouter;