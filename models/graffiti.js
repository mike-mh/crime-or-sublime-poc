var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var graffitiSchema = new Schema(
  {
    url: { type: String, unique: true, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    sublime: { type: Number, required: true },
    crime: { type: Number, required: true }
  },
  {
    minimize: false
  });



var Graffiti = mongoose.model('Graffiti', graffitiSchema);

module.exports = Graffiti;