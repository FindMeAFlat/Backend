const _ = require('lodash');

import { filterStopsByDistance, fetchRatingByDistance } from "./../distance";
import CustomApiWrapper from "./../customApi";

// example to fill in form
// {
//   url: "http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=ad1950ed444c7c779dce3ec27dac5fa6",
//   propertyAccess: "data.main.temp",
//   maxRatingValue: 320,
//   importance: 10,
//   ascending: true
// }

async function fetchRatingsForStop(criteria, stop) {
    const ratings = await Promise.all(criteria.map(
        async ({ type, data }) => {
            if (type === 'distance') {
                return await fetchRatingByDistance(data, stop);
            }
            else if (type === 'custom') {
                return await new CustomApiWrapper(data).fetchRating(stop.coordinates);
            }
        }
    ));

    return _.sum(ratings) / _.sum(criteria.map(cr => cr.data.importance)); //weighted average
}

function sortByRating(stop1, stop2) {
    return stop1.rating >= stop2.rating ? -1 : 1;
}

export default async function getBestStops(req): Promise<any[]> {
    const { criteria, target, radius, city } = req.body;
    const STATIONS_COUNT = 10;

    const stops = await filterStopsByDistance(target, radius, city);
    const ratingStops = stops.map(stop => ({ stop, rating: fetchRatingsForStop(criteria, stop)}));

    return await Promise.all(ratingStops.map(x => x.rating)).then(() => {
        const filteredStops = ratingStops
            .sort(sortByRating)
            .map(stop => stop.stop)
            .slice(0, STATIONS_COUNT);

        return filteredStops;
    });
}
