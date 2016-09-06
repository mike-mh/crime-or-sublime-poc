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

mongoose.connect(mongoUri, function (err, res) {});

app.use(express.static('public'));
app.use(sessionConfiguration);

configureRouter(router);

app.use('/', router);
app.listen(port, function () {
  console.log('Server running on port ' + port.toString());
});

let https = require('https');

let options = {
  host: 'api.postmarkapp.com',
  port: 443,
  path: '/email',
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Postmark-Server-Token': process.env.POSTMARK_KEY
  }
}

let request = https.request(options, (response) => {
  response.on('data', (chunk) => {
    console.log(chunk);
  });
});

request.on('error',(error) => {
  console.log(error);
});

request.write(JSON.stringify({
  From: 'registration@crimeorsublime.com',
  To: '0x4d464d48@gmail.com',
  Subject: 'Oh yeah baby...',
  HtmlBody: '<b><i><h1>AHHHHHHHH!</h1></i></b>'
}));

request.end();