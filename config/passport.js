const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load teacher model
const Teacher = mongoose.model('teachers');

module.exports = function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    Teacher.findOne({email: email})
    .then(teacher => {
      if (!teacher) {
        return done(null, false, {message: 'No teacher found'});
      }

      bcrypt.compare(password, teacher.password, (error, isMatch) => {
        console.log(password, teacher.password);
        if (error) {
          throw error;
        }

        if (isMatch) {
          return done(null, teacher);
        } else {
          return done(null, false, {message: 'Password incorrect'});
        }
      });

    });
  }));

  passport.serializeUser((teacher, done) => {
    done(null, teacher.id);
  });

  passport.deserializeUser((id, done) => {
    Teacher.findById(id, function(error, teacher) {
      done(error, teacher);
    });
  });
};