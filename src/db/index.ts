import { ApiRepository } from './models/api';

const mongoose = require("mongoose");
mongoose.connect(`mongodb://root:root12@ds161102.mlab.com:61102/flat`);
mongoose.connection.on('error', console.error.bind(console, 'db:connection error'));
mongoose.connection.once('open', console.log.bind(console, "db:connected"));

export const Repositories = {
  Api: new ApiRepository(),
}
