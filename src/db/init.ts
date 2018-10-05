import { cities } from './models/city';
import { Repositories } from '.';

export function initCities() {
  cities.forEach(city => {
    const existingCity = Repositories.City.single({ name: city });
    if (!existingCity) Repositories.City.create({ name: city });
  });
}
