const mongoose = require('mongoose');
const EmployeeSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'role'
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'job'
  },
  dateHired: {
    type: Date
  },
  phone: {
    type: String
  },
  calendarId: {
    type: String
  },
  image: {
    type: String
  }
});

module.exports = Employee = mongoose.model('employee', EmployeeSchema);
