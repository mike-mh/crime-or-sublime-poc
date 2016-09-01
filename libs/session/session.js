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
//  store: new MongoStore({url: 'mongodb://0x4d464d48:theVictory12345!@ds145245.mlab.com:45245/cos_alpha'})
});