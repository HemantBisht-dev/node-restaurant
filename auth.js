// sets up Passport with a local authentication strategy, using a Person model for username and password

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // username & password strategy
const Person = require("./model/person");


passport.use(
  new LocalStrategy(async (USERNAME, PASSWORD, done) => {
    // authentication logic here
    try {
      console.log("Recieved credentials:", USERNAME, PASSWORD);
      const user = await Person.findOne({ username: USERNAME });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const isPasswordMatch = await user.comparePassword(PASSWORD);
      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport; //export configured passport