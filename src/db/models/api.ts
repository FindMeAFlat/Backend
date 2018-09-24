import { Document, Schema, Model, model } from "mongoose";
import axios from 'axios';

import { RepositoryBase } from '../baseRepository';

interface IApi {
  urlTemplate: string, //has to be js template with x & y properties e.g. "https://someapi.com/${lat}/${lon}"
  rating: {
    propertyAccess: string, //has to be sequence of nested objects properties separated with dot e.g. "propA.propB.propC"
    maxRatingValue: number, //maximum value of rating - needed to map this value to 1-100
  },
  importance: number, //value to set importance level of this api for user (1-100)
  userId?: number, //if no userId, then it's standard api
  ascending?: boolean, //defines if bigger is better (default: true)
}

class ApiWrapper {
  constructor(private api: IApi) { }

  fetchRating(lat: number, lon: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const { urlTemplate, rating: { propertyAccess, maxRatingValue }, importance } = this.api;

      const url = eval('`' + urlTemplate + '`');

      axios.get(url)
        .then(res => {
          const rating = propertyAccess.split('.').filter(path => path.length > 0).reduce((prev, curr) => prev != null ? prev[curr] : undefined, res);
          if (rating === undefined || typeof rating !== "number") reject(new Error("Cannot fetch rating..."));
          resolve(Math.round(parseFloat(rating) * importance * 100 / maxRatingValue));
        })
        .catch((err) => {
          reject(err);
        })
    });
  }
}

const ApiSchema: Schema = new Schema({
  urlTemplate: { type: String, required: true, },
  rating: {
    propertyAccess: { type: String, required: true, },
    maxRatingValue: { type: Number, required: true, },
  },
  importance: { type: Number, required: true, },
  userId: { type: Number, required: false, },
  ascending: { type: Boolean, required: false, },
});
interface IApiDocument extends Document, IApi { }
const Api: Model<IApiDocument> = model<IApiDocument>("Api", ApiSchema);

class ApiRepository extends RepositoryBase<IApi> { constructor() { super(Api); } }

export {
  ApiRepository,
  ApiWrapper,
  IApi
}
