const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const Employee = require('../../models/Employee');

// Auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

let _token = null;
let currentUser = null;
// Callback route for google to redirect to
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/',
  }),
  (req, res) => {
    currentUser = req.user;
    const payload = {
      user: {
        id: req.user.id,
      },
    };
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        _token = token;
        // console.log(_token);
      }
    );
    res.redirect('http://localhost:3000/auth');
  }
);

router.get('/google/success', (req, res) => {
  try {
    const token = _token;
    // console.log(token);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
  }
});

// @route   GET api/auth
// @desc    Load user
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    // console.log('currentUser', currentUser);
    if (currentUser) {
      const user = await Employee.findById(currentUser.id)
        .populate('role', ['id', 'title', 'isAdmin'])
        .populate('job', ['id', 'title']);
      res.json(user);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
