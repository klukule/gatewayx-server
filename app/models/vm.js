var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var VMSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    unique: true,
    required: true
  },
  lat:{
    type: Number,
    required: true
  },
  lng:{
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('VM', VMSchema);
