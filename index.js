var express = require('express');
var app = express();
var path = require('path');

var port = parseInt(process.argv[2]);

if(port === undefined || typeof(parseInt(process.argv[0])) !== "number")
{
  process.exit();
}

app.use(express.static('public'));
app.use(express.static('.'));



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
  console.log('zing!');
  console.log(path.join(__dirname + '/public/index.html'));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/compiled_app/login/login.component.html'));
});

app.listen(port, function () {
  console.log('Server running on port ' + port.toString());
});
