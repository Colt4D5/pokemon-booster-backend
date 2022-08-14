const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require('./utils/auth');
const userRouter = require('./routes/userRouter');
const cardsRouter = require('./routes/cardsRouter');
const profileRouter = require('./routes/profileRouter');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 5000;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log('Connected to MongoDB'));

app.use(`/users`, userRouter);
app.use(`/cards`, cardsRouter);
app.use('/profile', profileRouter);

app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: "This is the home page",
  });
})

app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.json({
    message: statusCode + ': ' + error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
  })
})

// function redirectToHome(req, res, next) {
//   if (req.session.user) {
//     next();
//   } else {
//     res.redirect('http://localhost:5173/');
//   }
// }

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
})