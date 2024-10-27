const express = require("express");
const db = require("./db");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // req.body

app.get("/", function (req, res) {
  res.send("Welcome to our restaurant");
});

// import the router files
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require('./routes/menuRoutes');

// use the routers
app.use("/person", personRoutes);
app.use('/menu',menuRoutes)

// listen to port 3000
app.listen(3000, () => {
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
