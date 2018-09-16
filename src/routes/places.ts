import { Router } from 'express';
import autoComplete from '../services/places';

const router = Router();

/* GET home page. */
router.post('/autocomplete', function (req, res, next) {
    const { query } = req.body;
    const predictions = autoComplete(query).then(response => {
        res.send(JSON.stringify(response));
    });
});

export default router;