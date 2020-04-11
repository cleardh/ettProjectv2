const mongoose = require('mongoose');
const CategorySchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  limit: {
    type: Number
  },
  isUnlimited: {
    type: Boolean,
    default: false
  },
  color: {
    type: String
  }
});

module.exports = Category = mongoose.model('category', CategorySchema);
