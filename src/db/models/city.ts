import { Document, Schema, Model, model } from "mongoose";

import { RepositoryBase } from '../baseRepository';

const cities = ["Wrocław", "Kraków", "Warszawa", "Gdańsk"];

interface ICity {
  name: string,
}

const CitySchema: Schema = new Schema({
  name: { type: String, required: true, },
});
interface ICityDocument extends Document, ICity { }
const City: Model<ICityDocument> = model<ICityDocument>("City", CitySchema);

class CityRepository extends RepositoryBase<ICity> { constructor() { super(City); } }

export {
  cities,
  CityRepository,
  ICity
}
