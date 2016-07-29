var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var MachineSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  hardware:{
    type: String,
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
module.exports = mongoose.model('Machine', MachineSchema);
