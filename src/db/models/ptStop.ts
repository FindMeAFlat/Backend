import { Document, Schema, Model, model } from "mongoose";
import axios from 'axios';

import { RepositoryBase } from '../baseRepository';

interface IPtStop {
  city: string,
  name: string,
  coordinates: {
    lat: string,
    lon: string,
  }
}

const PtStopSchema: Schema = new Schema({
  city: { type: String, required: true, },
  name: { type: String, required: false, },
  coordinates: {
    lat: { type: String, required: true, },
    lon: { type: String, required: true, },
  }
});
interface IPtStopDocument extends Document, IPtStop { }
const PtStop: Model<IPtStopDocument> = model<IPtStopDocument>("PtStop", PtStopSchema);

class PtStopRepository extends RepositoryBase<IPtStop> { constructor() { super(PtStop); } }

export {
  PtStopRepository,
  IPtStop
}
