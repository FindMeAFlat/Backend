import { ApiRepository } from './models/api';
import { PtStopRepository } from './models/ptStop';
import { CityRepository } from './models/city';
import registerCrons from './crons';
import { initCities } from './init';

const mongoose = require("mongoose");
mongoose.connect(`mongodb://root:root12@ds161102.mlab.com:61102/flat`);
mongoose.connection.on('error', console.error.bind(console, 'db:connection error'));
mongoose.connection.once('open', console.log.bind(console, "db:connected"));

export const Repositories = {
  Api: new ApiRepository(),
  PtStop: new PtStopRepository(),
  City: new CityRepository(),
};

export function init() {
  initCities();
  registerCrons();
}