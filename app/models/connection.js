var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var ConnectionSchema = new Schema({
  parent: {
    type: String,
    required: true
  },
  child:{
    type: String,
    required: true
  },
  upload:{
    type: Number,
    required: true
  },
  download:{
    type: Number,
    required: true
  }
});
module.exports = mongoose.model('Connection', ConnectionSchema);
