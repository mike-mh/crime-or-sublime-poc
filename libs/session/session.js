'use strict';

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

let mongoose = require('mongoose');

module.exports = session({
  secret: process.env.COOKIE_SECRET,
  cookie: { maxAge: 2628000000 },
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({url: process.env.MONGODB_URI || 'mongodb://localhost/cos'})
});