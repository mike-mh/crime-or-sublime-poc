var addLoginRoutes = require('./login');
var addUserProfileRoutes = require('./user-profile');
var addUserRegistrationRoutes = require('./user-registration');

module.exports = function(router)
{
  addLoginRoutes(router);
  addUserProfileRoutes(router);
  addUserRegistrationRoutes(router);
}