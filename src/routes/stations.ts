import { Router } from 'express';
import {filterByDistance} from "../services/distance/helpers";

const router = Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
    const { target, radius, city } = req.body;
    filterByDistance(target, radius, city).then(results => {
        res.send(results)
    })
});

export default router;