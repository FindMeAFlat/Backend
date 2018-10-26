const { ImportMock } = require('ts-mock-imports');

import getBestStops from './../../services/stations';
import * as distanceService from './../../services/distance';
import { equal } from 'assert';

describe("stations - getBestStops", () => {
    const criteria = {
        url: "http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=ad1950ed444c7c779dce3ec27dac5fa6",
        propertyAccess: "data.main.temp",
        maxRatingValue: 320,
        importance: 10,
        ascending: true
    }

    it("should return at most 10 stations", async () => {
        ImportMock.mockFunction(distanceService, 'filterStopsByDistance', Promise.resolve(Array(20).fill({})));
        ImportMock.mockFunction(distanceService, 'fetchRatingByDistance', 10);
        equal((await getBestStops({ body: { criteria: [ { data: criteria } ] } })).length, 10);
    });
});
