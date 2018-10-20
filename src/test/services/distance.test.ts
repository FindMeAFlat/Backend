import { deepEqual, equal } from "assert";
import { mock, when, anything, instance } from 'ts-mockito';
import * as google from '@google/maps';

const { ImportMock } = require('ts-mock-imports');

import { filterStopsByDistance, fetchRatingByDistance } from './../../services/distance';
import { PtStopRepository } from "./../../db/models/ptStop";
import * as db from "../../db";

describe("distance.stops - filterStopsByDistance", async () => {
    it("should return only unique stops which are closer than radius", async () => {
        const coordinates = { lat: 1, lon: 1 };
        const stops = [
            {
                city: "City1",
                name: "Stop1",
                coordinates: {
                  lat: coordinates.lat.toString(10),
                  lon: coordinates.lon.toString(10),
                }
            },
            {
                city: "City1",
                name: "Stop2",
                coordinates: {
                  lat: "1.01",
                  lon: "1.02",
                }
            },
            {
                city: "City1",
                name: "Stop2",
                coordinates: {
                  lat: "1.02",
                  lon: "1.03",
                }
            },
            {
                city: "City1",
                name: "Stop2",
                coordinates: {
                  lat: "1.2",
                  lon: "1.5",
                }
            },
        ];
    
        //Mock
        const mockedPtStopRepository: PtStopRepository = mock(PtStopRepository);
        when(mockedPtStopRepository.where(anything()))
            .thenReturn(Promise.resolve(stops));
        ImportMock.mockOther(db, 'Repositories', { PtStop: instance(mockedPtStopRepository) });

        deepEqual(await filterStopsByDistance(coordinates, 10, "City1"), stops.slice(0, 2));
    })
})

describe("distance.places - fetchRatingByDistance", async () => {
    const importance = 10;
    let googleStub;

    afterEach(() => {
        googleStub.restore();
    });

    it("should return 0 if there are no results for location", async () => {
        googleStub = ImportMock.mockFunction(google, 'createClient', {
            placesNearby: () => ({
                asPromise: () => Promise.resolve({ json: { results: [] } }) 
            })
        });

        equal(await fetchRatingByDistance(
            { selectedPlaceType: null, distance: {}, importance }, { coordinates: {} }), 
            0);
    });

    it("should return 100 * importance if there is some result for location", async () => {
        googleStub = ImportMock.mockFunction(google, 'createClient', {
            placesNearby: () => ({
                asPromise: () => Promise.resolve({ json: { results: [ {} ] } }) 
            })
        });

        equal(await fetchRatingByDistance(
            { selectedPlaceType: null, distance: {}, importance }, { coordinates: {} }), 
            100 * importance);
    });
});
