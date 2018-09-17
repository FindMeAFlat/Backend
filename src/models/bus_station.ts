const mongoose = require('mongoose');

const Bus_Station_Model = new mongoose.Schema({
  lat: Number,
  lng: Number,
  name: String,
});

mongoose.model('Bus_Station_Model', Bus_Station_Model);

export default mongoose.model('Bus_Station_Model');
