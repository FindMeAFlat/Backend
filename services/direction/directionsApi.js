//Cities serving Google Transit in Poland: Bialystok, Jaworzno, Łódź, Olsztyn, Szczecin, Warszawa, Zielona Gora

var key = 'AIzaSyBAFqFmtK0vxuJ7UjLXiRLKXebSdR9n9nQ';
var googleMapsClient = require('@google/maps').createClient({
  key: key,
  Promise: Promise
});

var getDirectionData = (origin, destination, mode) => {
	var secondsToMinutes = (seconds) => {
		return parseInt(Math.round(seconds/60), 10);
	};

	var metersToKilometers = (meters) => {
		return (Math.round(meters/100))/10;
	};

	var calculateDistances = (steps) => {
		var walkingDistance = 0;
		var walkingDuration = 0;
		var transitDistance = 0;
		var transitDuration = 0;
		var vehicles = [];
		
		for(var i=0;i<steps.length;i++){
			var step = steps[i];
			var travelMode = step.travel_mode;
			var stepDistance = step.distance;
			var stepDuration = step.duration;
			
			if(travelMode.toLowerCase() === 'transit'){
				var line = step.transit_details.line;
				vehicles.push({ 
					name: line.short_name, 
					type: line.vehicle.type
				});
				transitDistance += stepDistance.value;
				transitDuration += stepDuration.value;
			}
			if(travelMode.toLowerCase() === 'walking'){
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
			if(response.status === 200){
				var route = response.json.routes[0].legs[0];
				var res = mode.toLowerCase() === 'transit' ? calculateDistances(route.steps) : {};
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

exports.getDirectionData = getDirectionData;