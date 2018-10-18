const envDir = __dirname.split('/').slice(0,-2).join('/');
require('dotenv').config({ path: `${envDir}/.env` });
//Cities serving Google Transit in Poland: Bialystok, Jaworzno, Łódź, Olsztyn, Szczecin, Warszawa, Zielona Gora


const googleMapsClient = require('@google/maps').createClient({
	key: process.env.API_KEY,
	Promise: Promise
});

const getDirectionData = (origin, destination, mode) => {
	const secondsToMinutes = (seconds) => {
		return Math.round(parseInt(seconds, 10) / 60);
	};

	const metersToKilometers = (meters) => {
		return (Math.round(meters / 100)) / 10;
	};

	const calculateDistances = (steps) => {
		let walkingDistance = 0;
		let walkingDuration = 0;
		let transitDistance = 0;
		let transitDuration = 0;
		let vehicles = [];

		for (let i = 0; i < steps.length; i++) {
			const step = steps[i];
			const travelMode = step.travel_mode;
			const stepDistance = step.distance;
			const stepDuration = step.duration;

			if (travelMode.toLowerCase() === 'transit') {
				const line = step.transit_details.line;
				vehicles.push({
					name: line.short_name,
					type: line.vehicle.type
				});
				transitDistance += stepDistance.value;
				transitDuration += stepDuration.value;
			}
			if (travelMode.toLowerCase() === 'walking') {
				walkingDistance += stepDistance.value;
				walkingDuration += stepDuration.value;
			}
		}

		return {
			transitDistance: metersToKilometers(transitDistance),
			transitDuration: secondsToMinutes(transitDuration),
			walkingDistance: metersToKilometers(walkingDistance),
			walkingDuration: secondsToMinutes(walkingDuration),
			vehicles: vehicles
		};
	};

	return new Promise((resolve, reject) => {
		googleMapsClient.directions(
			{
				origin: origin,
				destination: destination,
				mode: mode
			}
		)
			.asPromise()
			.then((response) => {
				if (response.status === 200) {
					const route = response.json.routes[0].legs[0];
					const res = mode.toLowerCase() === 'transit' ? calculateDistances(route.steps) : {} as any;
					res.distance = metersToKilometers(route.distance.value);
					res.duration = secondsToMinutes(route.duration.value);

					resolve(res);
				}
				else {
					reject('Status is not 200');
				}
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export { getDirectionData };