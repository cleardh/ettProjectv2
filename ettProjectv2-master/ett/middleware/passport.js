const config = require('config');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const Employee = require('../models/Employee');

passport.serializeUser((employee, done) => {
  done(null, employee.id);
});

passport.deserializeUser((id, done) => {
  Employee.findById(id).then((employee) => {
    done(null, employee);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // Options for the google strategy
      callbackURL: '/api/auth/google/redirect',
      clientID: config.get('oauthClientID'),
      clientSecret: config.get('oauthClientSecret'),
    },
    (accessToken, refreshToken, profile, done) => {
      // check if employee already exists in our db
      Employee.findOne({ email: profile.emails[0].value })
        .then((currentEmployee) => {
          if (currentEmployee) {
            // already have the employee
            done(null, currentEmployee);
          } else {
            // if not, create employee in our db
            new Employee({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              role: null,
              job: null,
              dateHired: '',
              phone: '',
              calendarId: '',
              image: profile.photos[0].value,
            })
              .save()
              .then((newEmployee) => {
                done(null, newEmployee);
              });
          }
        })
        .catch((err) => console.error(err.message));
    }
  )
);
