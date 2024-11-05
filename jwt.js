const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library

// Middleware function to verify JWT tokens
const jwtMiddleware = (req, res, next) => {

  // check authorization
  const auth = req.headers.authorization
  if(!auth) return res.status(401).json({error: 'Token not found'})
    
  // Extract the JWT token from the request headers
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the 'Authorization' header
  if (!token) return res.status(401).json({ error: "Unauthorized" }); // If no token is found, send a 401 Unauthorized response

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object for use in subsequent middleware/routes
    req.userPayload = decoded;
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.log(error); // Log any error that occurs during token verification
    res.status(401).json({ error: "Invalid token" }); // Send a 401 Unauthorized response if verification fails
  }
};

// Function to generate a JWT token
const generateToken = (userData) => {
  // Generate a new JWT token using the user data and secret key
  return jwt.sign(userData, process.env.JWT_SECRET);
};

// Export the middleware and token generation function for use in other files
module.exports = { jwtMiddleware, generateToken };
