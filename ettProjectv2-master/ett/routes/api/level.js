const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const Level = require('../../models/Level');

// @route   POST api/level
// @desc    Create level
// @access  private
router.post(
  '/',
  [auth, [check('title', 'Title is required').exists()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, lvl } = req.body;
    try {
      let level = await Level.findOne({ title });

      if (level) {
        return res.status(400).json({ msg: 'Level already exists' });
      }

      level = new Level({
        title,
        lvl
      });

      await level.save();
      res.json(level);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/level
// @desc    Get all levels
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const levels = await Level.find();

    if (!levels) {
      return res.status(400).json({ msg: 'Level not found' });
    }
    res.json(levels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/level/:title
// @desc    Get level by title
// @access  private
router.get('/title/:title', auth, async (req, res) => {
  try {
    const level = await Level.findOne({ title: req.params.title });
    if (!level) {
      return res.status(400).json({ msg: 'Level not found' });
    }
    res.json(level);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/level/:levelId
// @desc    Delete level
// @access  private
router.delete('/:levelId', auth, async (req, res) => {
  try {
    let level = await Level.findById(req.params.levelId);
    if (!level) {
      return res.status(400).json({ msg: 'Level not found' });
    }
    await level.remove();
    res.json(level);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
