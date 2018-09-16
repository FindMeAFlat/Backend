import axios from 'axios';
import { Promise } from 'es6-promise';

const standardApis: ApiMod[] = [];
const userApis: { [key: string]: ApiMod[] } = {}

interface Api {
  url: string,
  accessPathToRating: string,
  maxRating: number
}

class ApiMod {
  constructor(private api: Api) { }

  fetchRating(x, y): Promise<number> {
    return new Promise((resolve, reject) => {
      const { url, accessPathToRating, maxRating } = this.api;
      axios.get(url).then(res => {
        resolve(Math.round(parseFloat(accessPathToRating.split('.').filter(path => path.length > 0).reduce((prev, curr) => prev != null ? prev[curr] : undefined, res)) * 100 / maxRating));
      },
        err => {
          console.error(err);
          reject(err);
        })
    });
  }
}

function getUserApis(userId: number): ApiMod[] {
  if (userApis[userId] === undefined) userApis[userId] = [];
  return userApis[userId];
}

function addStandardApi(api: Api): void {
  standardApis.push(new ApiMod(api));
}

function addUserApi(userId: number, api: Api): boolean {
  getUserApis(userId).push(new ApiMod(api));
  return true;
}

function getApis(userId: number): ApiMod[] {
  return standardApis.concat(getUserApis(userId));
}

export {
  Api,
  addStandardApi,
  addUserApi,
  getApis,
}