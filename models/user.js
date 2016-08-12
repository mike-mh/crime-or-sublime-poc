var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    userName: { type: String, unique: true, required: true },
    favourites: [ObjectId]
  },
  {
    minimize: false
  });

var User = mongoose.model('User', userSchema);

module.exports = User;