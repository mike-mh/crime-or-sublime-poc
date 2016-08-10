var model = require('./models/index');
var express = require('express');
var app = express();
var path = require('path');
var jws = require('jws');
var mongoose = require('mongoose');
var port = parseInt(process.argv[2]) || 5000;
var cookieSecret = process.env.COOKIE_SECRET;
var currentTimeStamp = new Date().getTime();
var configureRouter = require('./routes/routes');
var router = express.Router();

mongoose.connect('mongodb://localhost/cos');

app.use(express.static('public'));
app.use(express.static('.'));
configureRouter(router);
/*app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
  console.log(path.join(__dirname + '/public/index.html'));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/compiled_app/login/login.component.html'));
  res.cookie('THIS_COOKIE', signature, {httpOnly: true, maxAge: (1000 * 60 * 5).toString()});
});*/
app.use('/', router);
app.listen(port, function () {
  console.log('Server running on port ' + port.toString());
  const test = {
    header: { alg: 'HS256' },
    payload: {iss: 'right here', timestamp: currentTimeStamp},
    encoding: 'binary',
    secret: new Buffer(process.env.COOKIE_SECRET, 'hex')
  }

  mongoose.Promise = global.Promise;  

  signature = jws.sign(test);
  var badSignature = 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyaWdodCBoZXJlIn0.2DT9zYnd_yWObrfvOJ1NBq2P4ERyfDRva8K-G-Ah8y2'

  console.log('THE SIGNATURE!');
  console.log(signature);

  console.log('DECODED!');
  console.log(jws.decode(signature));
  console.log(jws.verify(signature, 'HS256', new Buffer(process.env.COOKIE_SECRET, 'hex')));
  console.log(jws.verify(badSignature, 'HS256', 'super secret!'));
  console.log(cookieSecret);
  console.log(currentTimeStamp);
});
