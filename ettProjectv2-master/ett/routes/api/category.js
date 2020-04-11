const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const Category = require('../../models/Category');

// @route   POST api/category
// @desc    Create category
// @access  private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').exists(),
      check('color', 'Color is required').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, limit, isUnlimited, color } = req.body;
    try {
      let category = await Category.findOne({ title });

      if (category) {
        return res.status(400).json({ msg: 'Category already exists' });
      }

      category = new Category({
        title,
        limit,
        isUnlimited,
        color,
      });

      await category.save();
      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/category/:catId
// @desc    Update category
// @access  private
router.put('/:catId', auth, async (req, res) => {
  try {
    let category = await Category.findById(req.params.catId);

    if (!category) {
      return res.status(400).json({ msg: 'Category not found' });
    }

    const { title, limit, isUnlimited, color } = req.body;

    const newCategory = {
      title,
      limit,
      isUnlimited,
      color,
    };

    category = await Category.findByIdAndUpdate(
      req.params.catId,
      { $set: newCategory },
      { new: true }
    );

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/category
// @desc    Get all categories
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return res.status(400).json({ msg: 'Category not found' });
    }
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/category/:title
// @desc    Get category by title
// @access  private
router.get('/title/:title', auth, async (req, res) => {
  try {
    const category = await Category.findOne({ title: req.params.title });
    if (!category) {
      return res.status(400).json({ msg: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/category/:categoryId
// @desc    Delete category
// @access  private
router.delete('/:categoryId', auth, async (req, res) => {
  try {
    let category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(400).json({ msg: 'Category not found' });
    }
    await category.remove();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
