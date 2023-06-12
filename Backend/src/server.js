require('dotenv').config();
require('./database/Strategy/Microsoft');
const express = require('express');
const app = express();
const fs = require('fs')

const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const Store = require('connect-mongo');

const cors = require('cors')
const whitelist = ['http://localhost:3000', 'https://yoylo.moe', 'http://localhost:5000'];
app.use(cors({
  origin: whitelist,
  credentials: true,
  optionSuccessStatus: 200,
}))

const path = require('path');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const port = process.env.PORT || 5000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 60000 * 60 * 24 * 7,
  },
  resave: false,
  saveUninitialized: false,
  store: Store.create({ mongoUrl: process.env.DATABASE_URL })
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize())
app.use(passport.session())

const apiRoutes = require('./routes');
app.use("/api", apiRoutes);

// app.use(express.static(path.join(__dirname, 'public/build')));
// app.use('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
// });

app.listen(port, () => console.log(`Backend running on ${port}`));

