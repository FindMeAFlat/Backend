const url = require('url');

import { IApi, ApiWrapper } from '../db/models/api';
import { Repositories } from './../db';
import ValidationResult from '../models/validationResult';

const apiRepository = Repositories.Api;

async function getApis(userId: number): Promise<ApiWrapper[]> {
  const rawApis = await apiRepository.where({ $or: [{ userId: undefined }, { userId }] });
  return rawApis.map(rawApi => new ApiWrapper(rawApi));
}

function addApi(api: IApi): Promise<IApi> {
  return apiRepository.create(api);
}

function addUserApi(api: IApi): Promise<IApi> {
  function checkApi(api: IApi): ValidationResult {
    const validationResult = new ValidationResult();
    const { urlTemplate, rating: { propertyAccess, maxRatingValue }, importance, userId } = api;

    if (!userId) validationResult.addErrorMessage("UserId must be provided...");

    if (typeof importance !== "number" || importance <= 0 || importance > 100) validationResult.addErrorMessage("Importance must be a number in range [1:100]...");

    if (typeof propertyAccess !== "string" || new RegExp(/^\s*\S+\s*$/g).test(propertyAccess.trim()) === false) validationResult.addErrorMessage("Property access schema is not valid...");

    if (typeof maxRatingValue !== "number" || maxRatingValue <= 0) validationResult.addErrorMessage("Max rating value must be a positive number...");

    if (urlTemplate.indexOf("${lat}") === -1 || urlTemplate.indexOf("${lon}") === -1) validationResult.addErrorMessage("Url should contain ${lat} and ${lon}...");

    try { new url.URL(urlTemplate); } catch (e) { console.log(e); validationResult.addErrorMessage("Url is not valid..."); }

    if (validationResult.valid)
      new ApiWrapper(api).fetchRating(1, 1).catch((err) => { validationResult.addErrorMessage("Cannot fetch example data from API..."); });

    return validationResult;
  }

  const { valid, errors } = checkApi(api);
  if (!valid) { errors.forEach(error => console.error(error)); return Promise.resolve(null); }

  return addApi(api);
}

[
  //TODO: register our apis here...
].forEach(addApi);

// addUserApi({
//   urlTemplate: "http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=ad1950ed444c7c779dce3ec27dac5fa6",
//   rating: {
//     propertyAccess: "data.main.temp",
//     maxRatingValue: 320,
//   },
//   importance: 10,
//   userId: 9
// }).then(api => console.log(api));

export {
  addUserApi,
  getApis,
}