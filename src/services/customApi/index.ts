import axios from 'axios';
import { Mutex, MutexInterface } from 'async-mutex';

import Coordinates from './../../models/coordinates';
import ICustomApi from './../../models/customApi';
import { Repositories } from '../../db';

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
    private lastReq: number; //date in milliseconds
    private mutex: MutexInterface;

    constructor(private api: ICustomApi) {
        this.validApi = this.checkCustomApi().valid;
        this.lastReq = 0;
        this.mutex = new Mutex();
    }

    checkCustomApi = (): ValidationResult => {
        const validationResult = new ValidationResult();
        const { url, requestsLimit, propertyAccess, maxRatingValue, importance } = this.api;

        if (requestsLimit && requestsLimit <= 50) validationResult.addErrorMessage("Limit of requests must be a number in range [51:...] or empty...")

        if (typeof importance !== "number" || importance <= 0 || importance > 100) validationResult.addErrorMessage("Importance must be a number in range [1:100]...");

        if (typeof propertyAccess !== "string" || new RegExp(/^\s*\S+\s*$/g).test(propertyAccess.trim()) === false) validationResult.addErrorMessage("Property access schema is not valid...");

        if (maxRatingValue <= 0) validationResult.addErrorMessage("Max rating value must be a positive number...");

        if (url.indexOf("${lat}") === -1 || url.indexOf("${lon}") === -1) validationResult.addErrorMessage("Url should contain ${lat} and ${lon}...");

        try { new URL(url); } catch (e) { validationResult.addErrorMessage("Url is not valid..."); }

        if (validationResult.valid)
            this.fetchRating({ lat: 1, lon: 1 }).catch((err) => { validationResult.addErrorMessage("Cannot fetch example data from API..."); });

        return validationResult;
    }

    fetchRating(coordinates: Coordinates): Promise<{ data: ICustomApi, rating: number }> {
        if (!this.validApi) return Promise.resolve(null);

        const { lat, lon } = coordinates; //hack:lat and lon are used for eval

        return new Promise(async (resolve, reject) => {
            const { url, requestsLimit, propertyAccess, maxRatingValue, importance, ascending } = this.api;

            let throttleTime;

            this.mutex
                .acquire()
                .then((release) => {
                    const now = Date.now();
                    throttleTime = requestsLimit ? (1000 / requestsLimit) - Math.abs(now - this.lastReq) : 0;
                    this.lastReq = Date.now() + throttleTime;
                    release();

                    setTimeout(() => {
                        axios.get(eval('`' + url + '`'))
                        .then(res => {
                            const rating = propertyAccess.split('.').filter(path => path.length > 0).reduce((prev, curr) => prev != null ? prev[curr] : undefined, res);
                            if (rating === undefined || typeof rating !== "number") reject(new Error("Cannot fetch rating..."));
                            const absoluteRating = Math.round(parseFloat(rating) * importance * 100 / maxRatingValue);
                            const finalRating = ascending ? absoluteRating : 10000 - absoluteRating;
                            resolve({ data: { ...this.api, finalRating }, rating: finalRating });
                        })
                        .catch((err) => {
                            reject(err);
                        })
                    }, Math.max(throttleTime, 0));
                });
        });
    }
}

function addCustomCriteria(userId: string, name: string, customApi: ICustomApi): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (!new CustomApiWrapper(customApi).checkCustomApi().valid) { resolve(false); }

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
