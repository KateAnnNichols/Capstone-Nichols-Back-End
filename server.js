const express = require("express");
// const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const jwt = require("express-jwt");
// const jwksRsa = require("jwks-rsa");
// var cors = require("cors");
// For local testing only!  Enables CORS for all domains
// app.use(cors());

const app = express();
const port = process.env.PORT || 5000;

// const authConfig = {
//   domain: "YOUR_DOMAIN",
//   audience: "YOUR_API_IDENTIFIER"
// };

// middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN
// const checkJwt = jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
//   }),

//   audience: authConfig.audience,
//   issuer: `https://${authConfig.domain}/`,
//   algorithm: ["RS256"]
// });

// db config
const db = require("./config/database");
console.log(db.mongoURI);

// connect to mongoose
mongoose
  .connect("mongodb://localhost/sticker-dev", {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// load route & model
const students = require("./routes/students");
const Student = mongoose.model("students");
app.use("/students", students);

// // ROUTES
// // get students for dashboard
// app.get("/", checkJwt, (request, response) => {
//   Student.find(/*{ teacher: request.user.name }*/)
//     .sort({ name: 1 })
//     .then(students => {
//       console.log(students);
//       response.json(students);
//     });
// });

// // add new student
// app.post("/", checkJwt, (request, response) => {
//   console.log(request.body);
//   let errors = [];
//   console.log(`New student: ${request.body.name}`);
//   console.log(`Current teacher: ${request.body.teacher}`);
//   if (!request.body.name) {
//     errors.push({ text: `Please add the student's name.` });
//   }
//   if (errors.length > 0) {
//     console.log(errors);
//   } else {
//     const newStudent = {
//       name: request.body.name,
//       teacher: request.body.teacher,
//       boardsCompletedByDate: []
//     };
//     new Student(newStudent).save().then(student => {
//       response.json(student);
//     });
//   }
// });

// // edit student
// app.put("/:id", checkJwt, (request, response) => {
//   console.log(request.body);
//   Student.findByIdAndUpdate(
//     request.params.id,
//     { $set: request.body },
//     (err, student) => {
//       response.json(student);
//     }
//   );
// });

// // load student
// app.put("/:id", checkJwt, (request, response) => {
//   console.log(`Retrieving student: ${request.params.id}`);
//   Student.findById(request.params.id, (err, student) => {
//     response.json(student);
//   });
// });

// // delete student
// app.delete("/:id", checkJwt, (request, response) => {
//   console.log(request.params);
//   console.log(`Deleting student: ${request.params.id}`);
//   Student.remove({ _id: request.params.id }).then(() => {
//     response.sendStatus(200);
//   });
// });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
