import { createClient } from '@google/maps';
import { calcGeoDistance } from './../helpers';

async function fetchRatingByDistance({ selectedPlaceType, distance, importance }, { coordinates }): Promise<{ rating: number, data: any[] }> {
    return createClient({
        key: process.env.REACT_APP_GOOGLE_PLACES_KEY,
        Promise: Promise
    })
        .placesNearby({
            radius: distance,
            type: selectedPlaceType,
            location: [coordinates.lat, coordinates.lon],
        })
        .asPromise()
        .then(({ json: { results } }) => {
            const bestResult = results[0];
            return {
                rating: bestResult ? 100 * importance : 0,
                data: bestResult
                    ? calcGeoDistance({ lat: bestResult.geometry.location.lat, lon: bestResult.geometry.location.lng }, coordinates)
                    : null,
            };
        })
        .catch(e => console.error(e));
}

export default fetchRatingByDistance;