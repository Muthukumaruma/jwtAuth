const express = require('express');
const router = express.Router();
const User = require('../../models/user'); 
const auth = require('../../middileware/auth');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');


// get all users
router.get('/user', auth, async (req, res) => {
  const user = await User.find().select('-password');

  res.json(user);
});

// get user by id
router.get('/user/:id', auth, async (req, res) => {
  const {id} = req.params;
  const user = await User.findById({_id:id}).select('-password');

  res.json(user);
});


// create user
router.post('/user', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({
    name,
    email,
    password,
  });

  user.password = await bcript.hash(user.password, 8);

  try {
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await  User.findOne( { email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  // const encPassword = bcript.hash(password, 8);
 
  const valid = await bcript.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ message: 'Invalid password' });
  }
  const token = jwt.sign({ id: user._id, name:user.name, email:user.email }, process.env.JWT_SECRET, {
    expiresIn: 86400,
  });

  user.token = token;
  User.findByIdAndUpdate(user._id, user, { new: true });
  res.cookie("access_token",{ token });
  res.json({ token, user });

});

//Logout 
router.get('/logout', async (req, res) => {
  res.clearCookie('access_token');
  res.json({ message: 'Logout' });
});

module.exports = router;