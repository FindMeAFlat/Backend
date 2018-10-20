import { createClient } from '@google/maps';

const googleMapsClient = createClient({
    key: process.env.REACT_APP_GOOGLE_PLACES_KEY,
    Promise: Promise
});

function getRadius({ distance, unit }) {
    switch (unit) {
        case 'km': return distance * 1000;
        case 'mi': return distance * 1609;
        default: return distance;
    }
}

async function fetchRatingByDistance({ selectedPlaceType, distance, importance }, { coordinates }) {
    const radius = getRadius(distance);

    return googleMapsClient
        .placesNearby({
            radius,
            type: selectedPlaceType,
            location: [ coordinates.lat, coordinates.lon ],
        })
        .asPromise()
        .then(({ json: { results }}) => {
            return results.length > 0
                ? 100 * importance
                : 0;
        })
        .catch(e => console.error(e));
}

export default fetchRatingByDistance;