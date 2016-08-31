'use strict';

let model = require('./models/index');;
let express = require('express');
let app = express();
let path = require('path');
let jws = require('jws');
let mongoose = require('mongoose');
let sessionConfiguration = require('./libs/session/session');

mongoose.Promise = global.Promise;

let port = process.env.PORT || 5000;
let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/cos';
let cookieSecret = process.env.COOKIE_SECRET;
let configureRouter = require('./routes/routes');
let router = express.Router();
let bodyParser = require('body-parser');

mongoose.connect(mongoUri, function (err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + process.env.MONGODB_URI + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + process.env.MONGODB_URI);
  }
});

app.use(express.static('public'));
app.use(sessionConfiguration);

configureRouter(router);

app.use('/', router);
app.listen(port, function () {
  console.log('Server running on port ' + port.toString());
});
