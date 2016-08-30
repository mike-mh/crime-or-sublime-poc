'use strict';

let addTwitterRoutes = require('./twitter');

module.exports = function(router)
{
  addTwitterRoutes(router);
}