var key = 'AIzaSyC_G9gtZMkt9d_4pgPY1bYj71TusF63oxc';

var googleMapsClient = require('@google/maps').createClient({
    key: key,
    Promise: Promise
});

module.exports = autoComplete = (query) => {
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
