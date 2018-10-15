import { Router, Request, Response } from 'express';
import autoComplete from '../services/places';

function getCities(req: Request, res: Response): void {
    const { query } = req.body;
    autoComplete(query).then(response => {
        res.send(JSON.stringify(response));
    });
}

const autoCompleteRouter = Router();
autoCompleteRouter.post('/autocomplete', getCities);

export default autoCompleteRouter;
