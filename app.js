const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const userRouter = require('./routes/userRouter');
require('dotenv').config();

const app = express();

var sess = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:5173',
}));

const port = process.env.PORT || 5000;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log('Connected to MongoDB'));

app.use(`/users`, userRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!!!' });
})

app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.json({
    message: statusCode + ': ' + error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
  })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
})