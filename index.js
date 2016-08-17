'use strict';

let model = require('./models/index');
let express = require('express');
let app = express();
let path = require('path');
let jws = require('jws');
let mongoose = require('mongoose');

mongoose.Promise = global.Promise;  

let port = parseInt(process.argv[2]) || 5000;
let cookieSecret = process.env.COOKIE_SECRET;
let currentTimeStamp = new Date().getTime();
let configureRouter = require('./routes/routes');
let router = express.Router();
let bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/cos');

app.use(express.static('public'));

configureRouter(router);

app.use('/', router);
app.listen(port, function () {
  console.log('Server running on port ' + port.toString());
});
