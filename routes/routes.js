'use strict';

let path = require('path');
//var router = require('express').Router();
let addGraffitiRoutes = require('./graffiti/index');
let addSocialMediaRoutes = require('./social-media/index');
let addUserManagementRoutes = require('./user-management/index');

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