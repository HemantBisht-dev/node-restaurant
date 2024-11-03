const express = require("express");
const db = require("./db");
const app = express();

const passport = require("./auth");

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // req.body
require("dotenv").config();

// middleware functions ---> it's a way to add a extra functionality to a application

// logRequest --> it will log (save) the number of user comes in our application

const logRequest = (req, res, next) => {
  console.log(
    `${new Date().toLocaleString()} Request Made to ${req.originalUrl}`
  );
  next(); // move on next phase
};

// apply middleware to all Routes
app.use(logRequest); // this line tells Express to use this middleware for all routes

// authenticate
app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate("local", { session: false });

// Define Routes
app.get("/", function (req, res) {
  res.send("Welcome to our restaurant");
});

// import the router files
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuRoutes");

// use the routers
app.use("/person", personRoutes);
app.use("/menu", menuRoutes);

const PORT = process.env.PORT || 3000;

// listen to port 3000
app.listen(PORT, () => {
  console.log("listening to port 3000");
});

// {
//   "name": "hemant",
//   "age": 26,
//   "work": "chef",
//   "mobile": "123-456-789",
//   "email": "hmntbst2201@gmail.com",
//   "address": "123 main street",
//   "salary": 600000
// }

// {
//   "name": "Idli",
//   "price": 120,
//   "taste": "spicy",
//   "is_drink": false,
//   "ingredients": [
//       "Aloo",
//       "masala",
//       "coconut chutny"
//   ],
//   "num_sales": 62
// }
