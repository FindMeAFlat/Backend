const _ = require('lodash');

import { Repositories } from '../../db';
import { IPtStop } from "../../db/models/ptStop";
import Coordinates from '../../models/coordinates';
import { calcGeoDistance } from './../helpers';

interface StringCoordinate {
    lat: string;
    lon: string;
}

function stringPointToFloat(coor: StringCoordinate): Coordinates {
    return {
        lat: parseFloat(coor.lat),
        lon: parseFloat(coor.lon)
    }
}

export default async function filterStopsByDistance(target: Coordinates, radius: number, city: string): Promise<IPtStop[]> {
    const filteredStations = (await Repositories.PtStop.where({ city })).filter(station => {
        const floatCoors = stringPointToFloat(station.coordinates);
        const distance = calcGeoDistance(target, floatCoors);
        return distance <= radius;
    });
    const uniqueStations = _.uniqBy(filteredStations, (entry) => entry.name);
    /*const filteredByTime = [];
    for(let i = 0; i < stations.length; i++) {
        console.log(i/stations.length * 100);
        await new Promise((res, rej) => setTimeout(res, 100))
        const distances = await getDirectionData({
            lat: parseFloat(stations[i].coordinates.lat),
            lng: parseFloat(stations[i].coordinates.lon)
        }, {
            lat: target.lat,
            lng: target.lon
        }, 'transit');
        if(distances.duration < 20) {
            filteredByTime.push(stations[i]);
        }
    }*/
    return uniqueStations;
}

/*
const getTransportationTime = () => {
    const coorsStart = {
        lng: 16.978234,
        lat: 51.0932018
    };

    const coorsEnd = {
        lng: 17.018589,
        lat: 51.113330
    }

   .then(console.log)
};

getTransportationTime();
const callstackOffice = {
    lat: 51.113208,
    lon: 17.018707,
};

filterByDistance(calstackOffice, 4, 'Wrocław').then(console.log)*/