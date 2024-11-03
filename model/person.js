// Using Node.js `require()`
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: { type: Number },
  work: {
    type: String,
    enum: ["chef", "waiter", "manager"],
    required: true,
  },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  salary: { type: Number, required: true },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// pre middleware is triggered before the save operation on a mongoose modal

personSchema.pre("save", async function (next) {
  const person = this;

  // hash the password only if it has been modified (or is new)
  if (!person.isModified("password")) {
    return next();
  }
  try {
    // generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(person.password, salt);

    // override the plain password with the hashed one
    person.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

// create person model
const Person = mongoose.model("person", personSchema);
module.exports = Person;
