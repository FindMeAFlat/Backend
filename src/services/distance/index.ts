import { Repositories } from '../../db/index'
import {IPtStop} from "../../db/models/ptStop";
import { createClient } from '@google/maps';
import { Coordinates } from '../../models/coordinates';

const googleMapsClient = createClient({
    key: process.env.REACT_APP_GOOGLE_PLACES_KEY,
    Promise: Promise
});

interface StringCoordinate {
    lat: string;
    lon: string;
}

function degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

function calcGeoDistance(coor1: Coordinates, coor2: Coordinates): number {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(coor2.lat-coor1.lat);
    const dLon = degreesToRadians(coor2.lon-coor1.lon);

    const lat1 = degreesToRadians(coor1.lat);
    const lat2 = degreesToRadians(coor2.lat);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadiusKm * c;
}

function stringPointToFloat(coor: StringCoordinate): Coordinates {
    return {
        lat: parseFloat(coor.lat),
        lon: parseFloat(coor.lon)
    }
}

async function filterStopsByDistance(target: Coordinates, radius: number, city: string): Promise<IPtStop[]> {
    const res = await Repositories.PtStop.where({ city });
    return res.filter(station => {
        const floatCoors = stringPointToFloat(station.coordinates);
        const distance = calcGeoDistance(target, floatCoors);
        return distance <= radius;
    });
}

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

export { filterStopsByDistance, fetchRatingByDistance }

// TEST XD

/*

const callstackOffice = {
    lat: 51.113208,
    lon: 17.018707,
};

filterStopsByDistance(callstackOffice, 4, 'Wrocław').then(console.log)*/
