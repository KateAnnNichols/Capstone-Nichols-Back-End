const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
// const passport = require("passport");

require("../models/Teacher");
const Teacher = mongoose.model("teachers");

// teacher login
router.get("/login", (request, response) => {
  response.render("teachers/login");
});

// teacher logout
router.get("/logout", (request, response) => {
  request.logout();
  request.flash("success_msg", "You are logged out");
  response.redirect("/teachers/login");
});

// teacher signup
router.get("/signup", (request, response) => {
  response.render("teachers/signup");
});

// login form POST
// router.post("/login", (request, response, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/students",
//     failureRedirect: "/teachers/login",
//     failureFlash: true
//   })(request, response, next);
// });

// teacher registration form POST
router.post("/signup", (request, response) => {
  let errors = [];

  if (request.body.password != request.body.passwordConfirmation) {
    errors.push({ text: "Passwords do not match." });
  }

  if (request.body.password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters." });
  }

  if (errors.length > 0) {
    console.log(errors);
    // response.render("teachers/signup", {
    //   errors: errors,
    //   name: request.body.name,
    //   email: request.body.email,
    //   password: request.body.password,
    //   passwordConfirmation: request.body.passwordConfirmation
    // });
  } else {
    Teacher.findOne({ email: request.body.email }).then(teacher => {
      console.log(teacher);

      if (teacher) {
        console.log("email registered");
        console.log("error_msg", "Email already registered.");
        // response.redirect("/teachers/signup");
      } else {
        let newTeacher = new Teacher({
          name: request.body.name,
          email: request.body.email,
          password: request.body.password
        });

        // hash the password
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newTeacher.password, salt, (error, hash) => {
            if (error) {
              throw error;
            }

            newTeacher.password = hash;
            newTeacher
              .save()
              .then(newTeacher => {
                console.log(
                  "success_msg",
                  "You are now registered and can login."
                );
              })
              .catch(error => {
                console.log(
                  "error_msg",
                  "An error has occurred. Please try again."
                );
              });
          });
        });
      }
    });
  }
});

module.exports = router;
