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
    const rating = _.sum(ratings.map(({ rating }) => rating)) / _.sum(criteria.map(cr => cr.data.importance));
    return {
        rating,
        data: ratings.map(({ rating, data }) => data ? data : rating),
    };
}

function sortByRating(stop1, stop2) {
    return stop1.ratingData.rating >= stop2.ratingData.rating ? -1 : 1;
}

export default async function getBestStops(req): Promise<any[]> {
    const { criteria, target, radius, city } = req.body;
    const STATIONS_COUNT = 10;

    const stops = await filterStopsByDistance(target, radius, city);
    const ratingStops = stops.map(stop => ({ stop, ratingData: fetchRatingsForStop(criteria, stop) }));

    return await Promise.all(ratingStops.map(x => x.ratingData)).then((ratingData) => {
        const filteredStops = ratingStops
            .sort(sortByRating)
            .map(({ stop }, i) => ({ stop, data: ratingData[i].data }))
            .slice(0, STATIONS_COUNT);

        return filteredStops;
    });
}
