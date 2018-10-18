import { Repositories } from '../../db/index'
import {IPtStop} from "../../db/models/ptStop";
import {getDirectionData} from '../direction/directionsApi';
const _ = require('lodash');

interface Coordinate {
    lat: number;
    lon: number;
}

interface StringCoordinate {
    lat: string;
    lon: string;
}

function degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

function calcGeoDistance(coor1: Coordinate, coor2: Coordinate): number {
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

function stringPointToFloat(coor: StringCoordinate): Coordinate {
    return {
        lat: parseFloat(coor.lat),
        lon: parseFloat(coor.lon)
    }
}

export async function filterByDistance(target: Coordinate, radius: number, city: string): Promise<IPtStop[]> {
    return Repositories.PtStop.where({ city }).then(async res => {
        const filtered = res.filter(station => {
            const floatCoors = stringPointToFloat(station.coordinates);
            const distance = calcGeoDistance(target, floatCoors);
            return distance <= radius;
        });

        const stations = _.uniqBy(filtered, (entry) => entry.name);
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

        return stations;
    })

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

getTransportationTime();*/
// TEST XD

/*

const callstackOffice = {
    lat: 51.113208,
    lon: 17.018707,
};

filterByDistance(calstackOffice, 4, 'Wrocław').then(console.log)*/