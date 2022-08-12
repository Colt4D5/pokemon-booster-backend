const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(users);
    }
  }).sort({ _id: -1 });
})

router.post('/', async (req, res) => {
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
    console.log(newUser);
    await newUser.save();
    res.redirect('http://localhost:5173/');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (result) {
        res.redirect(`http://localhost:5173?user=${user.username}`);
      } else {
        res.redirect(`http://localhost:5173/register?error=incorrect%20password`);
      }
    });
  } catch (err) {
    res.json(err);
  }
})


module.exports = router;