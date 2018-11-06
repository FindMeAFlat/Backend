import { Router, Request, Response } from 'express';

import { addCustomCriteria, getCustomCriteria } from '../services/customApi';

function addCriteria(req: Request, res: Response): void {
    const { userId, name, customApi } = req.body;

    addCustomCriteria(userId, name, customApi).then(success => {
        res.json({ success })
    });
}

function getCriteria(req: Request, res: Response): void {
    const { userId } = req.query;

    getCustomCriteria(userId).then((customApis) => res.json({ customApis }));
}

const customApiRouter = Router();
customApiRouter.get('/', getCriteria);
customApiRouter.post('/', addCriteria);

export default customApiRouter;
