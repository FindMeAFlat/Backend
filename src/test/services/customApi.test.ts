import { equal } from "assert";

import CustomApiWrapper from './../../services/customApi';

describe("customApiWrapper", () => {
    const baseApi = {
        url: "http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}",
        propertyAccess: "data.main.temp",
        maxRatingValue: 320,
        importance: 10,
        ascending: true
    };
    const coordinates = { lat: 1, lon: 1 };

    describe("fetchRating should return null when ", () => {
        it("url is not valid", async () => {
            const api = { ...baseApi, url: "wrong/url" };
            const customApiWrapper = new CustomApiWrapper(api);
            equal(await customApiWrapper.fetchRating(coordinates), null);
        });

        it("url does not contain ${lat} or ${lon}", async () => {
            const api = { ...baseApi, url: "http://api.openweathermap.org/data" };
            const customApiWrapper = new CustomApiWrapper(api);
            equal(await customApiWrapper.fetchRating(coordinates), null);
        });

        it("propertyAccess has not valid format", async () => {
            const api = { ...baseApi, propertyAccess: "invalid format" };
            const customApiWrapper = new CustomApiWrapper(api);
            equal(await customApiWrapper.fetchRating(coordinates), null);
        });
        
        it("maxRatingValue is not positive", async () => {
            const api = { ...baseApi, maxRatingValue: -1 };
            const customApiWrapper = new CustomApiWrapper(api);
            equal(await customApiWrapper.fetchRating(coordinates), null);
        });

        it("importance is smaller than 1", async () => {
            const api = { ...baseApi, importance: 0 };
            const customApiWrapper = new CustomApiWrapper(api);
            equal(await customApiWrapper.fetchRating(coordinates), null);
        });

        it("importance is larger than 100", async () => {
            const api = { ...baseApi, importance: 101 };
            const customApiWrapper = new CustomApiWrapper(api);
            equal(await customApiWrapper.fetchRating(coordinates), null);
        });
    });
})
