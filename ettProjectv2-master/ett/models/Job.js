const mongoose = require('mongoose');
const JobSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  }
});

module.exports = Job = mongoose.model('job', JobSchema);
