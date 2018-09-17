import { Promise } from 'es6-promise';
import bus_station  from '../models/bus_station';
import db from '../db'
db();

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyC_G9gtZMkt9d_4pgPY1bYj71TusF63oxc',
    Promise: Promise
});

const lat = 51.110636;
const lon = 17.033354;


googleMapsClient.places({
    location: [lat, lon],
    type: 'bus_station',
    radius: 10000,
})
    .asPromise()
    .then(({ json: { results } })  => {
        const promises = results.map((result) => {
            const { geometry : { location }, name } = result;
            return bus_station.create({ ...location, name })
        })
        Promise.all(promises).then(() => {
            console.log('done')
        })
    })
    .catch(console.log);


