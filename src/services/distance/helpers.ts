import { Repositories } from '../../db/index'
import {IPtStop} from "../../db/models/ptStop";

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
        lat: parseFloat(coor.lon),
        lon: parseFloat(coor.lat)
    }
}

export function filterByDistance(target: Coordinate, radius: number, city: string): Promise<IPtStop[]> {
    return Repositories.PtStop.where({ city }).then(res => {
        return res.filter(station => {
            const floatCoors = stringPointToFloat(station.coordinates);
            const distance = calcGeoDistance(target, floatCoors);
            return distance <= radius;
        })
    })
}

// TEST XD

/*

const callstackOffice = {
    lat: 51.113208,
    lon: 17.018707,
};

filterByDistance(callstackOffice, 4, 'Wrocław').then(console.log)*/
