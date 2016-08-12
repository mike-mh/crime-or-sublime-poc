var models = require('../../models/index');
var path = require('path');


const LOGIN_URL = '/login';

function loginCallback(req, res)
{
  res.sendFile(path.join(__dirname + '/../../public/compiled_app/login/login.component.html'));
  res.cookie('THIS_COOKIE', signature, { httpOnly: true, maxAge: (1000 * 60 * 5).toString() });
  console.log('HI FRIEND!');
  
  models.User.find({userName: 'test'}, function(err, item) {console.log(JSON.stringify(item))});
}

module.exports = function(router)
{
  router.get(LOGIN_URL, loginCallback);
}