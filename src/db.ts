const mongoose = require('mongoose');


export default function(){
    mongoose.connect(`mongodb://root:root12@ds161102.mlab.com:61102/flat`)
}