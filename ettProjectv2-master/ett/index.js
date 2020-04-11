const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
require('./middleware/passport');

const app = express();
app.use(cors());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ extended: false }));

// Connect database
connectDB();

app.get('/', (req, res) => {
  console.log(req.user);
  res.send('API running...');
});

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/employee', require('./routes/api/employee'));
app.use('/api/job', require('./routes/api/job'));
app.use('/api/role', require('./routes/api/role'));
app.use('/api/request', require('./routes/api/request'));
app.use('/api/category', require('./routes/api/category'));
app.use('/api/organization', require('./routes/api/organization'));
app.use('/api/level', require('./routes/api/level'));
app.use('/api/calendar', require('./routes/api/calendar'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
