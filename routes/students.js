const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// load student model
require("../models/Student");
const Student = mongoose.model("students");

const authConfig = {
  domain: "YOUR_DOMAIN",
  audience: "YOUR_API_IDENTIFIER"
};

// middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

// ROUTES
// get students for dashboard
router.put(
  "/teacher",
  /*checkJwt,*/ (request, response) => {
    console.log(request.body);
    Student.find({ teacher: request.body.teacher })
      .sort({ name: 1 })
      .then(students => {
        console.log(students);
        response.json(students);
      })
      .catch(err => console.log(err));
  }
);

// add new student
router.post(
  "/",
  /*checkJwt,*/ (request, response) => {
    // console.log(request);
    let errors = [];
    console.log(`New student: ${request.body.name}`);
    console.log(`Current teacher: ${request.body.teacher}`);
    if (!request.body.name) {
      errors.push({ text: `Please add the student's name.` });
    }
    if (errors.length > 0) {
      console.log(errors);
    } else {
      const newStudent = {
        name: request.body.name,
        teacher: request.body.teacher,
        boardsCompletedByDate: []
      };
      new Student(newStudent).save().then(student => {
        response.json(student);
      });
      console.log(newStudent);
    }
  }
);

// edit student
router.put(
  "/:id",
  /*checkJwt,*/ (request, response) => {
    console.log(request.body);
    Student.findByIdAndUpdate(
      request.params.id,
      { $set: request.body },
      (err, student) => {
        response.json(student);
      }
    );
  }
);

// load student
router.put(
  "/:id",
  /*checkJwt,*/ (request, response) => {
    console.log(`Retrieving student: ${request.params.id}`);
    Student.findById(request.params.id, (err, student) => {
      response.json(student);
    });
  }
);

// delete student
router.delete(
  "/:id",
  /*checkJwt,*/ (request, response) => {
    console.log(request.params);
    console.log(`Deleting student: ${request.params.id}`);
    Student.remove({ _id: request.params.id }).then(() => {
      response.sendStatus(200);
    });
  }
);

module.exports = router;
