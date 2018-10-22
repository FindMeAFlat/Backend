const _ = require('lodash');
import { computeDestinationPoint } from 'geolib';
const query_overpass = require('query-overpass');

function getBBoxCoordinates(lat, lon, radius) {
    let points = [];
    points.push(computeDestinationPoint({lat,lon},radius, 225));
    points.push(computeDestinationPoint({lat,lon},radius, 45));
    return points;
}

function removeDuplicates(array) {
    let newArray = [];
    array.map((street) => {
        street = street.split(' ');
        if(!newArray.includes(_.last(street))){
            newArray.push(_.last(street));
        }
    });
    return newArray;
}

export default async function getNearestRoads(req) {
    const { station, radius } = req.body;
    const bbox = getBBoxCoordinates(station[0], station[1], radius);
    const query = `[out:json];(node["highway"~"tertiary|residential"](${bbox[0].latitude},${bbox[0].longitude},${bbox[1].latitude},${bbox[1].longitude});way["highway"~"tertiary|residential"](${bbox[0].latitude},${bbox[0].longitude},${bbox[1].latitude},${bbox[1].longitude});relation["highway"~"tertiary|residential"](${bbox[0].latitude},${bbox[0].longitude},${bbox[1].latitude},${bbox[1].longitude}););(._;>;);out;`;

    return new Promise((resolve, reject) => {
        query_overpass(query, (err, res) => {
            const streets = res.features.filter((feature) => {
                const { properties: {tags: { name } } } = feature;
                return !!name;
            }).map((feature) => {
                const { properties: {tags: { name } } } = feature;
                return name;
            });
            return resolve(removeDuplicates(streets));
        });
    });
}