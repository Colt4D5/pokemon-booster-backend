const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(users);
    }
  }).sort({ _id: -1 });
}

exports.createUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPw = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPw,
      email: req.body.email
    })
    await newUser.save();
    res.redirect('http://localhost:5173/');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.loginUser = async (req, res) => {
  // find user by email
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  // compares entered password to hashed user password 
  const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
  if (!passwordIsValid) return res.status(401).json({ message: 'Invalid email or password' });
  // create and assign a token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  // send token as a cookie
  res.status(201).json({ 
    status: 'success',
    token,
    redirect_path: "/"
  });
}

exports.logoutUser = (req, res) => {
  res.status(201).json({ 
    status: 'success',
    message: 'You have been logged out',
    redirect_path: "/"
  });
}

exports.authorize = async (req, res) => {
  const token = req.body.token;
  if (!token) return res.json({ status: 'failed', message: 'No token provided' });
  let decodedId
  try {
    decodedId = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.json({ message: 'Token is not valid' });
  }
  const loggedInUser = await User.findOne({ id: decodedId.id})
  res.status(200).json({
    status: 'success',
    message: 'You are authorized',
    loggedInUser: {
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      username: loggedInUser.username,
      wallet: loggedInUser.wallet
    }
  });
}