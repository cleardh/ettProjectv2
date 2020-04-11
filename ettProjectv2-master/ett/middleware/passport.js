const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/keys');
const Employee = require('../models/Employee');

passport.serializeUser((employee, done) => {
  done(null, employee.id);
});

passport.deserializeUser((id, done) => {
  Employee.findById(id).then(employee => {
    done(null, employee);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // Options for the google strategy
      callbackURL: '/api/auth/google/redirect',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      // check if employee already exists in our db
      // console.log(profile);
      Employee.findOne({ email: profile.emails[0].value })
        .then(currentEmployee => {
          if (currentEmployee) {
            // already have the employee
            // console.log('employee is: ', currentEmployee);
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
              image: profile.photos[0].value
            })
              .save()
              .then(newEmployee => {
                // console.log('New employee created: ', newEmployee);
                done(null, newEmployee);
              });
          }
        })
        .catch(err => console.error(err.message));
    }
  )
);
