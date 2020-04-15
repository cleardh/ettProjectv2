const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const Role = require('../../models/Role');

// @route   POST api/role
// @desc    Create role
// @access  private
router.post(
  '/',
  [auth, [check('title', 'Title is required').exists()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, isAdmin } = req.body;
    try {
      let role = await Role.findOne({ title });

      if (role) {
        return res.status(400).json({ msg: 'Role already exists' });
      }

      role = new Role({
        title,
        isAdmin,
      });

      await role.save();
      res.json(role);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/role/
// @desc    Get all roles
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const roles = await Role.find();
    if (!roles) {
      return res.status(400).json({ msg: 'Role not found' });
    }
    res.json(roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/role/:id
// @desc    Get role by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(400).json({ msg: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/role/:title
// @desc    Get role by title
// @access  private
router.get('/title/:title', auth, async (req, res) => {
  try {
    const role = await Role.findOne({ title: req.params.title });
    if (!role) {
      return res.status(400).json({ msg: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/role/:id
// @desc    Delete role
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    let role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(400).json({ msg: 'Role not found' });
    }
    await role.remove();
    res.json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
