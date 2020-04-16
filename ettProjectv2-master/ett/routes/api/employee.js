const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const moment = require('moment-timezone');
const auth = require('../../middleware/auth');
const Employee = require('../../models/Employee');

// @route   POST api/employee
// @desc    Register employee
// @access  private
router.post(
  '/',
  [
    auth,
    [
      check('role', 'Role is required').exists(),
      check('job', 'Job is required').exists(),
      check('calendarId', 'CalendarID is required').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      email,
      role,
      job,
      dateHired,
      phone,
      calendarId,
      image,
    } = req.body;

    try {
      let employee = await Employee.findOne({ calendarId });

      if (employee) {
        return res.status(400).json({ msg: 'Employee already exists' });
      }

      employee = new Employee({
        firstName,
        lastName,
        email,
        role,
        job,
        dateHired,
        phone,
        calendarId,
        image,
      });

      await employee.save();
      res.json(employee);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/employee
// @desc    Get all employee
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('role', ['id', 'title', 'isAdmin'])
      .populate('job', ['id', 'title']);
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/employee/me
// @desc    Get current employee
// @access  private
router.get('/me', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id)
      .populate('role', ['id', 'title', 'isAdmin'])
      .populate('job', ['id', 'title']);
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/employee/:email
// @desc    Get employee by email
// @access  private
router.get('/email/:email', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.params.email })
      .populate('role', ['id', 'title', 'isAdmin'])
      .populate('job', ['id', 'title']);
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/employee/:id
// @desc    Update employee
// @access  private
router.put('/:id', auth, async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    const { role, job, dateHired, phone, calendarId } = req.body;
    const newEmployee = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      role: role ? role : employee.role,
      job: job ? job : employee.job,
      dateHired: dateHired
        ? moment(dateHired).tz('America/Toronto')
        : moment(employee.dateHired).tz('America/Toronto'),
      phone: phone ? phone : employee.phone,
      calendarId: calendarId ? calendarId : employee.calendarId,
      image: employee.image,
    };

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: newEmployee },
      { new: true }
    );
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE api/employee/:id
// @desc    Delete employee
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    await employee.remove();
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
