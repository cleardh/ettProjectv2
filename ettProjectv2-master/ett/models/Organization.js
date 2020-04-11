const mongoose = require('mongoose');
const OrganizationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'level',
    required: true
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee',
    required: true
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employee'
    }
  ]
});

module.exports = Organization = mongoose.model(
  'organization',
  OrganizationSchema
);
