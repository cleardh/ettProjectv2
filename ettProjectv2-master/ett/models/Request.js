const mongoose = require('mongoose');
const RequestSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee',
    required: true,
  },
  dateS: {
    type: Date,
    required: true,
  },
  dateE: {
    type: Date,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  googleEventId: {
    type: String,
  },
});

module.exports = Request = mongoose.model('request', RequestSchema);
