const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  const {token} = req.cookies.access_token;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = auth;