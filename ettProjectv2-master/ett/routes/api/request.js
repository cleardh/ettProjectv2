const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
const moment = require('moment-timezone');
const { convertArrayToCSV } = require('convert-array-to-csv');

const Request = require('../../models/Request');
const Employee = require('../../models/Employee');
const Orgnization = require('../../models/Organization');

// @route   POST api/request
// @desc    Create request
// @access  private
router.post(
  '/',
  [
    auth,
    [
      check('email', 'Employee email is required').exists(),
      check('dateS', 'Start Date is required').exists(),
      check('dateE', 'End Date is required').exists(),
      check('category', 'Category is required').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, dateS, dateE, category } = req.body;
    try {
      const employee = await Employee.findOne({ email });

      const requests = await Request.find()
        .populate('user', ['id'])
        .populate('category', ['title']);
      console.log(requests);

      let request = await Request.findOne({ user: employee, dateS });
      const overlaps = requests.filter(
        (r) =>
          r.user._id.equals(employee._id) &&
          ((r.dateS <= dateS && dateS <= r.dateE) ||
            (r.dateS <= dateE && dateE <= r.dateE))
      );

      if (request) {
        return res.status(400).json({ msg: 'Request already exists' });
      }
      if (overlaps.length > 0) {
        return res.status(400).json({ msg: 'Request overlapping' });
      }

      request = new Request({
        user: employee,
        dateS,
        dateE,
        category,
      });

      await request.save();
      res.json(request);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/request
// @desc    Get all requests
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('user', ['id', 'email', 'calendarId'])
      .populate('category', ['id', 'title', 'color']);

    if (!requests) {
      return res.status(400).json({ msg: 'Request not found' });
    }
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/request/:orgId
// @desc    Get requests by organization
// @access  private
router.get('/org/:orgId', auth, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId)
      .populate('head', ['id', 'firstName', 'lastName', 'email'])
      .populate('level', ['id', 'title'])
      .populate({
        path: 'members',
        populate: { path: 'employee', model: 'employee' },
      });
    const requests = await Request.find()
      .populate('user', ['id', 'email', 'calendarId'])
      .populate('category', ['id', 'title', 'color']);

    if (!organization) {
      return res.status(400).json({ msg: 'Organization not found' });
    }
    if (!requests) {
      return res.status(400).json({ msg: 'Request not found' });
    }

    let orgRequests = [];
    organization.members.map((m) =>
      requests.map((r) => r.user.email === m.email && orgRequests.push(r))
    );

    res.json(orgRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/request/:employeeId
// @desc    Get request by employeeid
// @access  private
router.get('/:employeeId', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);
    const requests = await Request.find()
      .populate('user', ['id', 'email', 'calendarId'])
      .populate('category', ['id', 'title', 'color']);
    const requestsByUser = requests.filter((request) =>
      request.user._id.equals(employee._id)
    );
    if (!requestsByUser) {
      return res.status(400).json({ msg: 'Request not found' });
    }
    res.json(requestsByUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/request/:employeeid/:isConfirmed
// @desc    Get confirmed request by employeeid
// @access  private
router.get('/confirmed/:employeeid', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);
    const requests = await Request.find()
      .populate('user', ['id', 'email', 'calendarId'])
      .populate('category', ['id', 'title', 'color']);
    const requestsByUser = requests.filter(
      (request) =>
        request.user._id.equals(employee._id) && request.isConfirmed === true
    );
    if (!requestsByUser) {
      return res.status(400).json({ msg: 'Request not found' });
    }
    res.json(requestsByUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/request/:employeeid/:isConfirmed/:categoryId
// @desc    Get confirmed request by employeeid & category
// @access  private
router.get('/confirmed/:employeeid/:categoryId', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);
    const requests = await Request.find()
      .populate('user', ['id', 'email', 'calendarId'])
      .populate('category', ['id', 'title', 'color']);
    const requestsByUser = requests.filter(
      (request) =>
        request.user._id.equals(employee._id) &&
        request.isConfirmed === true &&
        request.category._id.equals(req.params.categoryId)
    );
    if (!requestsByUser) {
      return res.status(400).json({ msg: 'Request not found' });
    }
    res.json(requestsByUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/request/:requestId
// @desc    Update(Confirm) request
// @access  private
router.put('/:requestId', auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.requestId);
    if (!request) {
      return res.status(400).json({ msg: 'Request not found' });
    }
    const newRequest = {
      user: request.user,
      dateS: request.dateS,
      dateE: request.dateE,
      category: request.category,
      isConfirmed: true,
    };
    request = await Request.findByIdAndUpdate(
      req.params.requestId,
      { $set: newRequest },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/request/:requestId
// @desc    Delete request
// @access  private
router.delete('/:requestId', auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.requestId);
    if (!request) {
      return res.status(400).json({ msg: 'Request not found' });
    }
    await request.remove();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST start and end date
// @desc    Generate report
// @access  private
router.post('/report', auth, async (req, res) => {
  try {
    const { start, end } = req.body;

    let requests = await Request.find()
      .populate('user', ['firstName', 'lastName', 'email'])
      .populate('category', ['title']);

    if (start && end) {
      requests = requests.filter(
        (r) =>
          moment(r.dateS).tz('America/Toronto').format('YYYY-MM-DD') >=
            moment(start).tz('America/Toronto').format('YYYY-MM-DD') &&
          moment(r.dateS).tz('America/Toronto').format('YYYY-MM-DD') <=
            moment(end).tz('America/Toronto').format('YYYY-MM-DD')
      );
    } else if (start) {
      requests = requests.filter(
        (r) =>
          moment(r.dateS).tz('America/Toronto').format('YYYY-MM-DD') >=
          moment(start).tz('America/Toronto').format('YYYY-MM-DD')
      );
    } else if (end) {
      requests = requests.filter(
        (r) =>
          moment(r.dateS).tz('America/Toronto').format('YYYY-MM-DD') <=
          moment(end).tz('America/Toronto').format('YYYY-MM-DD')
      );
    }

    if (requests.length < 1) {
      return res.status(400).json({ msg: 'Request not found' });
    }

    const listObj = requests.map((r) => r._doc);
    const json2csvParser = new Json2csvParser({ header: true });
    const csv = json2csvParser.parse(listObj);

    fs.writeFile('ett.csv', csv, (err) => {
      if (err) throw err;
      console.log('CSV Report generated successfully!');
    });

    res.json({ file: 'ett.csv' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
