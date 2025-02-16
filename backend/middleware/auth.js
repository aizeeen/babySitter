const jwt = require("jsonwebtoken");
const Parent = require("../Models/Parent");
const Babysitter = require("../Models/Babysitter");

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Headers:', req.headers); // Debug log
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log('No token provided'); // Debug log
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    console.log('Verifying token:', token); // Debug log
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Decoded token:', decoded); // Debug log

    let user;
    // Check user type based on role in token
    if (decoded.role === 'babysitter') {
      user = await Babysitter.findById(decoded.id).select('-password');
    } else {
      user = await Parent.findById(decoded.id).select('-password');
    }

    console.log('Found user:', user); // Debug log
    
    if (!user) {
      console.log('No user found for token'); // Debug log
      return res.status(401).json({ message: "User not found" });
    }

    // Set the user object with id and role
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

module.exports = authMiddleware;
