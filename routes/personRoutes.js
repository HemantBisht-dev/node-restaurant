const express = require("express");
const router = express.Router();
const Person = require("../model/person");
const { jwtMiddleware, generateToken } = require("../jwt");

// POST route to add a person
router.post("/signup", async (req, res) => {
  try {
    // data coming from client
    const data = req.body; // Assuming the request body contains the person data

    // create a new person document using mongoose model
    const newPerson = new Person(data);

    // save new person to database
    const response = await newPerson.save();
    console.log("data saved");

    const payload = {
      id: response.id,
      username: response.username,
    };
    console.log(payload);

    const token = generateToken(payload);
    console.log("Token is: ", token);

    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

// login
router.post("./login", async (res, req) => {
  try {
    // Extract username and password form body
    const { username, password } = req.body;

    // Find the user by username
    const user = await Person.findOne({ username: username });

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username and password" });
    }

    // generate token
    const userPayload = {
      id: user.id,
      username: user.username,
    };

    const token = generateToken(userPayload);

    // return token in response
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

// profile
router.get('./profile',jwtMiddleware, async(res,req)=>{
  try {
    // this user we are accessing from token
    const userData = req.userPayload;

    // extracting user id from token
    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json(user)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
})

// get people data
router.get("/",jwtMiddleware,async (req, res) => {
  try {
    const data = await Person.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

// query params
router.get("/:work", async (req, res) => {
  try {
    const workType = req.params.work; // extract the work type from the Url parameter

    if (
      workType === "chef" ||
      workType === "manager" ||
      workType === "waiter"
    ) {
      // Assuming you already have a person model and mongoDB connection setup
      const data = await Person.find({ work: workType });
      console.log("persons work list fetched");

      // send this list of person with the specified work typr as a json response
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "invalid work type" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

//update
router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const updatedPersonData = req.body;

    const updatedPerson = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true, //Return the updated document
        runValidators: true, // Run mongoose validation
      }
    );

    if (!updatedPerson) {
      res.status(404).json({ error: "person not found" });
    }

    console.log("data fetched");
    res.status(200).json(updatedPerson);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id;

    const deletedPerson = await Person.findByIdAndDelete(personId);
    if (!deletedPerson) {
      res.status(404).json({ error: "person not found" });
    }
    console.log("person deleted");
    res.status(200).json({ message: "person deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
