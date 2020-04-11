const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const Job = require('../../models/Job');

// @route   POST api/job
// @desc    Create job
// @access  private
router.post(
  '/',
  [auth, [check('title', 'Title is required').exists()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title } = req.body;
    try {
      let job = await Job.findOne({ title });

      if (job) {
        return res.status(400).json({ msg: 'Job already exists' });
      }

      job = new Job({
        title
      });

      await job.save();
      res.json(job);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/job/
// @desc    Get all jobs
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find();
    if (!jobs) {
      return res.status(400).json({ msg: 'Job not found' });
    }
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/job/:id
// @desc    Get job by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(400).json({ msg: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/job/:title
// @desc    Get job by title
// @access  private
router.get('/title/:title', auth, async (req, res) => {
  try {
    const job = await Job.findOne({ title: req.params.title });
    if (!job) {
      return res.status(400).json({ msg: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/job/:id
// @desc    Delete job
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(400).json({ msg: 'Job not found' });
    }
    await job.remove();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
