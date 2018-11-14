import Coordinates from '../models/coordinates';

function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function calcGeoDistance(coor1: Coordinates, coor2: Coordinates): number {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(coor2.lat - coor1.lat);
  const dLon = degreesToRadians(coor2.lon - coor1.lon);

  const lat1 = degreesToRadians(coor1.lat);
  const lat2 = degreesToRadians(coor2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export { calcGeoDistance };