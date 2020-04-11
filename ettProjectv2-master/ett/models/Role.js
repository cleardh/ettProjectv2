const mongoose = require('mongoose');
const RoleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = Role = mongoose.model('role', RoleSchema);
