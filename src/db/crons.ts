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
        coordinates: { lat: coordinates[0], lon: coordinates[1] },
      });
    });
  });
}

export default function registerCrons() {
  cron.schedule('0 0 1 * *', () => { //every month
    const cities = ["Wrocław", "Kraków",];
    Repositories.PtStop.delete({}).then(() => cities.forEach(city => cronStops(city)));
  });
}
