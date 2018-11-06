import axios from 'axios';
import Coordinates from './../../models/coordinates';
import ICustomApi from './../../models/customApi';
import { Repositories } from '../../db';
import { ICriteria } from '../../db/models/criteria';

const URL = require('url').URL;

class ValidationResult {
    private readonly errorMessages: string[];
    private isValid: boolean;

    constructor() {
        this.isValid = true;
        this.errorMessages = [];
    }

    get valid(): boolean { return this.isValid; }
    get errors(): string[] { return this.errorMessages; }

    addErrorMessage = (errorMessage) => {
        this.isValid = false;
        this.errorMessages.push(errorMessage);
    }
}

class CustomApiWrapper {
    private validApi: boolean;

    constructor(private api: ICustomApi) {
        this.validApi = CustomApiWrapper.checkCustomApi(api).valid;
    }

    static checkCustomApi(customApi: ICustomApi): ValidationResult {
        const validationResult = new ValidationResult();
        const { url, propertyAccess, maxRatingValue, importance } = customApi;

        if (typeof importance !== "number" || importance <= 0 || importance > 100) validationResult.addErrorMessage("Importance must be a number in range [1:100]...");

        if (typeof propertyAccess !== "string" || new RegExp(/^\s*\S+\s*$/g).test(propertyAccess.trim()) === false) validationResult.addErrorMessage("Property access schema is not valid...");

        if (typeof maxRatingValue !== "number" || maxRatingValue <= 0) validationResult.addErrorMessage("Max rating value must be a positive number...");

        if (url.indexOf("${lat}") === -1 || url.indexOf("${lon}") === -1) validationResult.addErrorMessage("Url should contain ${lat} and ${lon}...");

        try { new URL(url); } catch (e) { validationResult.addErrorMessage("Url is not valid..."); }

        if (validationResult.valid)
            new CustomApiWrapper(customApi).fetchRating({ lat: 1, lon: 1 }).catch((err) => { validationResult.addErrorMessage("Cannot fetch example data from API..."); });

        return validationResult;
    }

    fetchRating(coordinates: Coordinates): Promise<number> {
        if (!this.validApi) return Promise.resolve(null);

        return new Promise((resolve, reject) => {
            const { url, propertyAccess, maxRatingValue, importance, ascending } = this.api;

            const { lat, lon } = coordinates; //hack:lat and lon are used for eval
            const evaluatedUrl = eval('`' + url + '`');

            axios.get(evaluatedUrl)
                .then(res => {
                    const rating = propertyAccess.split('.').filter(path => path.length > 0).reduce((prev, curr) => prev != null ? prev[curr] : undefined, res);
                    if (rating === undefined || typeof rating !== "number") reject(new Error("Cannot fetch rating..."));
                    const absoluteRating = Math.round(parseFloat(rating) * importance * 100 / maxRatingValue);
                    resolve(ascending ? absoluteRating : 10000 - absoluteRating);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }
}

function addCustomCriteria(userId: string, name: string, customApi: ICustomApi): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if(!CustomApiWrapper.checkCustomApi(customApi).valid) { resolve(false); }

        Repositories.Criteria.create({
            customApi,
            name,
            userId,
        })
        .then(() => resolve(true))
        .catch((e) => reject(e));
    });
}

async function getCustomCriteria(userId): Promise<{ name: string, customApi: ICustomApi }[]> {
    const criteria = await Repositories.Criteria.where({ userId });
    return criteria.map(criteria => ({ name: criteria.name, customApi: criteria.customApi }));
}

export { CustomApiWrapper, addCustomCriteria, getCustomCriteria };

export default CustomApiWrapper;
