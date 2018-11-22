import { Document, Schema, Model, model } from "mongoose";

import { RepositoryBase } from '../baseRepository';

const cities = [
  { name: "Wrocław", englishName: "Wroclaw" }, 
  { name: "Kraków", englishName: "Cracow" },
  { name: "Warszawa", englishName: "Warsaw" },
  { name: "Gdańsk", englishName: "Gdansk" },
];

interface ICity {
  name: string,
  englishName: string,
}

const CitySchema: Schema = new Schema({
  name: { type: String, required: true, },
  englishName: { type: String, required: true, },
});
interface ICityDocument extends Document, ICity { }
const City: Model<ICityDocument> = model<ICityDocument>("City", CitySchema);

class CityRepository extends RepositoryBase<ICity> { constructor() { super(City); } }

export {
  cities,
  CityRepository,
  ICity
}
