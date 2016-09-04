'use strict';

let addTwitterRoutes = require('./twitter');
let addFacebookRoutes = require('./facebook');

module.exports = function(router)
{
  addTwitterRoutes(router);
  addFacebookRoutes(router);
}