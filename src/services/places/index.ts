/*
import { createClient } from '@google/maps';


const googleMapsClient = createClient({
    key: key,
    Promise: Promise
});

const autoComplete = (query) => {
    console.log(query)
    return googleMapsClient.placesQueryAutoComplete({
        input: query,
        language: 'pl',
    })
        .asPromise()
        .then((response) => {
            console.log(response.json.predictions)
            return response.json.predictions
        })
        .catch(err => {
            console.log(err)
        })
}

export default autoComplete;
*/
