var express = require('express');
var router = express.Router();
const autoComplete = require('../services/places')
/* GET home page. */
router.post('/autocomplete', function(req, res, next) {
    const { query } = req.body;
    const predictions = autoComplete(query).then(response => {
        res.send(JSON.stringify(response));
    })
});

module.exports = router;