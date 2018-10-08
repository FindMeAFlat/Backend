import { cities } from './models/city';
import { Repositories } from '.';

export function initCities() {
  cities.forEach(city => {
    const existingCity = Repositories.City.single({ name: city });
    existingCity.then((foundCity) => {
      if(!foundCity) {
          Repositories.City.create({ name: city });
      }
    });
  });
}
