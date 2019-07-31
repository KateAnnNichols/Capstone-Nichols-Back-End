const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authenticationRequired } = require("../helpers/jwt");

// load student model
require("../models/Student");
const Student = mongoose.model("students");

// get students for index page
router.get("/", authenticationRequired, (request, response) => {
  // console.log(request);
  // console.log(`Retrieving students for teacher ${request.user.name}`);
  Student.find(/*{ teacher: request.user.name }*/)
    .sort({ name: 1 })
    .then(students => {
      console.log(students);
      response.json(students);
      // request.flash("success_msg", "Students successfully retrieved.");
      // response.render("students/index", { students: students });
    });
});

// add student form
// router.get("/add", ensureAuthenticated, (request, response) => {
//   response.render("students/add");
// });

// edit student form
// router.get("/edit/:id", ensureAuthenticated, (request, response) => {
// console.log(request.body);
// console.log(request.params);
// Student.findOne({ id: request.params._id }).then(student => {
//   console.log("Student: " + student);
// if (student.teacher != request.user.name) {
//   request.flash("error_msg", "Not authorized");
//   response.redirect("/students");
// } else {
// response.render("students/edit", { student: student });
// }
// });
// });

// add new student
router.post("/", authenticationRequired, (request, response) => {
  console.log(request.body);
  let errors = [];
  console.log(`New student: ${request.body.name}`);
  console.log(`Current teacher: ${request.body.teacher}`);
  if (!request.body.name) {
    errors.push({ text: `Please add the student's name.` });
  }

  if (errors.length > 0) {
    console.log(errors);
    // response.render("students/add", {
    //   errors: errors,
    //   name: request.body.name
    // });
  } else {
    const newStudent = {
      name: request.body.name,
      teacher: request.body.teacher,
      boardsCompletedByDate: []
    };
    new Student(newStudent).save().then(student => {
      // request.flash("success_msg", "Student successfully added.");
      // response.redirect("/students");
      response.json(student);
    });
  }
});

// edit student
router.put("/:id", authenticationRequired, (request, response) => {
  console.log(request.body);
  Student.findByIdAndUpdate(
    request.params.id,
    { $set: request.body },
    (err, student) => {
      response.json(student);
    }
  );
});

// load student
router.put("/:id", authenticationRequired, (request, response) => {
  // console.log(request.body);
  console.log(`Retrieving student: ${request.params.id}`);
  Student.findById(request.params.id, (err, student) => {
    // console.log(`Student name: ${student.name}`);
    // request.flash("success_msg", "Student successfully retrieved.");
    // response.render("students/");
    response.json(student);
  });
});

// delete student
router.delete("/:id", authenticationRequired, (request, response) => {
  console.log(request.params);
  console.log(`Deleting student: ${request.params.id}`);
  Student.remove({ _id: request.params.id }).then(() => {
    // request.flash("success_msg", "Student successfully removed.");
    // response.redirect("/students");
    response.sendStatus(200);
  });
});

module.exports = router;
