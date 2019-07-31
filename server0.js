const express = require("express");
// const session = require("express-session");
const bodyParser = require("body-parser");
// const methodOverride = require("method-override");
// const passport = require("passport");
// const path = require("path");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
// const OktaJwtVerifier = require("@okta/jwt-verifier");
var cors = require("cors");

const app = express();
// const port = process.env.PORT || 5000;
const port = process.env.PORT || 3001;

const authConfig = {
  domain: "YOUR_DOMAIN",
  audience: "YOUR_API_IDENTIFIER"
};

// load routes
const students = require("./routes/students");
const teachers = require("./routes/teachers");

// load models
const Student = mongoose.model("students");
const Teacher = mongoose.model("teachers");

// Define middleware that validates incoming bearer tokens
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

// const oktaJwtVerifier = new OktaJwtVerifier({
//   issuer: "https://dev-134015.okta.com/oauth2/default",
//   clientId: "0oa10v39pl0FD32AA357",
//   assertClaims: {
//     aud: "api://default"
//   }
// });

var cors = require("cors");

// passport configuration
// require("./config/passport")(passport);

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

// method override middleware
// app.use(methodOverride("_method"));

// For local testing only!  Enables CORS for all domains
app.use(cors());

// function authenticationRequired(req, res, next) {
//   const authHeader = req.headers.authorization || "";
//   const match = authHeader.match(/Bearer (.+)/);

//   if (!match) {
//     return res.status(401).end();
//   }

//   const accessToken = match[1];
//   const expectedAudience = "api://default";

//   return oktaJwtVerifier
//     .verifyAccessToken(accessToken, expectedAudience)
//     .then(jwt => {
//       req.jwt = jwt;
//       next();
//     })
//     .catch(err => {
//       res.status(401).send(err.message);
//     });
// }

// express session middleware
// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUninitialized: true
//   })
// );

// passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

app.use("/students", students);
app.use("/teachers", teachers);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
