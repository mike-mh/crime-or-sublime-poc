var path = require('path');

const REGISTER_USER_URL = '/register-user';
const REGISTRATION_PAGE_URL = '/registration-page';

function registerUserCallback(req, res)
{

}

function getRegistrationPageCallback(req, res)
{

}

module.exports = function(router)
{
  router.get(getRegistrationPageCallback);
  router.post(REGISTER_USER_URL, registerUserCallback);
}