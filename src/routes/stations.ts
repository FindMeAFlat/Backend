import { Router } from 'express';
import {filterByDistance} from "../services/distance/helpers";
const _ = require('lodash');


const router = Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
    const { target, radius, city } = req.body;
    filterByDistance(target, radius, city).then(results => {
        const stations = _.uniqBy(results, (entry) => entry.name);
        console.log(stations.length)
        res.send(stations);
    })
});

export default router;