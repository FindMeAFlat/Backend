/*

var googleMapsClient = require('@google/maps').createClient({
	key: key,
	Promise: Promise
});

var getPlacesDistance = (origins, destinations, mode) => {

	var secondsToMinutes = (seconds) => {
		return Math.round(parseInt(seconds, 10) / 60);
	};

	var metersToKilometers = (meters) => {
		return (Math.round(meters / 100)) / 10;
	};

	return new Promise((resolve, reject) => {
		googleMapsClient.distanceMatrix(
			{
				origins: origins,
				destinations: destinations,
				mode: mode
			}
		)
			.asPromise()
			.then((response) => {
				if (response.status === 200) {
					var distance = {
						distance: metersToKilometers(response.json.rows[0].elements[0].distance.value),
						time: secondsToMinutes(response.json.rows[0].elements[0].duration.value)
					}
					resolve(distance);
				}
				else {
					reject('Status is not 200');
				}
			})
			.catch((err) => {
				reject(err);
			});
	});
}

export { getPlacesDistance };
*/
