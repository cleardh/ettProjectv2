const mongoose = require('mongoose');
const LevelSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  }
});

module.exports = Level = mongoose.model('level', LevelSchema);
