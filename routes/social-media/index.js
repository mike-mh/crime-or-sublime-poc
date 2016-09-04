'use strict';

let addTwitterRoutes = require('./twitter');
let addFacebookRoutes = require('./facebook');
let addRedditRoutes = require('./reddit');

module.exports = function(router)
{
  addTwitterRoutes(router);
  addFacebookRoutes(router);
  addRedditRoutes(router);
}