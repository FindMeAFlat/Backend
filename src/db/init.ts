import { cities } from './models/city';
import { Repositories } from '.';

export function initCities() {
  cities.forEach(({ name, englishName }) => {
    const existingCity = Repositories.City.single({ name });
    existingCity.then((foundCity) => {
      if(!foundCity) {
          Repositories.City.create({ name, englishName });
      }
    });
  });
}
