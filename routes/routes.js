var path = require('path');
//var router = require('express').Router();
var addGraffitiRoutes = require('./graffiti/index');
var addSocialMediaRoutes = require('./social-media/index');
var addUserManagementRoutes = require('./user-management/index');

const DEFAULT_URL = '/';

function defaultCallback(req, res)
{
  res.sendFile(path.join(__dirname + '/../public/index.html'));
  console.log(path.join(__dirname + '/../public/index.html'));
}

module.exports = function(router)
{
  router.get(DEFAULT_URL, defaultCallback);
  addGraffitiRoutes(router);
  addSocialMediaRoutes(router);
  addUserManagementRoutes(router);
}