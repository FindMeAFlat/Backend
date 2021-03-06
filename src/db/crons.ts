import { Repositories } from '.';

const query_overpass = require('query-overpass');
const cron = require('node-cron');

function cronStops(city) {
  query_overpass(`[out:json];area[name="${city}"];nwr(area)[public_transport=stop_position];out;`, (err, res) => {
    res.features.map(feature => {
      const { properties: { tags: { name } }, geometry: { coordinates } } = feature;
      Repositories.PtStop.create({
        city,
        name,
        coordinates: { lon: coordinates[0], lat: coordinates[1] },
      });
    });
  });
}

export default function registerCrons() {
  cron.schedule('0 0 1 * *', async () => { //every month
    const cities = (await Repositories.City.where({})).map(({ name }) => name);
    Repositories.PtStop.delete({}).then(() => cities.forEach(city => cronStops(city)));
  });
}
