var express = require('express');
var app = express();
var path = require('path');
app.use(express.static('public'));
app.use(express.static('.'));

app.get('/', function(req, res) {
     res.sendFile(path.join(__dirname + '/public/index.html'));
     console.log('zing!');
     console.log(path.join(__dirname + '/public/index.html'));
});

app.get('/login', function(req, res) {
     res.sendFile(path.join(__dirname + '/public/compiled_app/login/login.component.html'));
     console.log('HEY!');
});

app.listen(8080, function() {
    console.log('Server running');
    console.log(__dirname);
});
