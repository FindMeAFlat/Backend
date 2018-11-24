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

async function fetchRatingsForStop(criteriaFunctions, criteriaImportanceSum, stop) {
    const ratings = await Promise.all(criteriaFunctions.map(async (criteriaFunc) => await criteriaFunc(stop)));
    return {
        rating: _.sum(ratings.map(({ rating }) => rating)) / criteriaImportanceSum,
        data: ratings.map(({ rating, data }) => data ? data : rating),
    };
}

function sortByRating(stop1, stop2) {
    return stop1.data.rating >= stop2.data.rating ? -1 : 1;
}

export default async function getBestStops(req): Promise<any[]> {
    const { criteria, target, radius, city } = req.body;
    const STATIONS_COUNT = 10;

    const criteriaFunctions = criteria.map(({ type, data }) => {
        if (type === 'distance') {
            return (stop) => fetchRatingByDistance(data, stop);
        }
        else if (type === 'custom') {
            const customApiWrapper = new CustomApiWrapper(data);
            return (stop) => customApiWrapper.fetchRating(stop.coordinates);
        }
    });

    const stops = await filterStopsByDistance(target, radius, city);
    const ratingStops = stops.slice(0, 10).map(stop => ({ stop, ratingData: fetchRatingsForStop(criteriaFunctions, _.sum(criteria.map(cr => cr.data.importance)), stop) }));
    return await Promise.all(ratingStops.map(x => x.ratingData)).then((ratingData) => {
        const filteredStops = ratingStops
            .map(({ stop }, i) => ({ stop, data: ratingData[i].data }))
            .sort(sortByRating)
            .slice(0, STATIONS_COUNT);

        return filteredStops;
    });
}
