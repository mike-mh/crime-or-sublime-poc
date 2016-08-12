const GET_USER_PROFILE_URL = '/get-profile/:id';

function getUserProfileCallback(req, res)
{
  
}

module.exports = function(router)
{
  router.get(GET_USER_PROFILE_URL, getUserProfileCallback);
}