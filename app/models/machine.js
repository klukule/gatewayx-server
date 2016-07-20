var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
// TODO: Propper Schema when finished database design
var MachineSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  ip:{
    type: String,
    required: true,
    unique: true    
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

module.exports = mongoose.model('machine', MachineSchema);
