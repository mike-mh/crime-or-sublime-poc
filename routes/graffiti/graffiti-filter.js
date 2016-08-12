const GET_GRAFFITI_URL = '/get-grafiti/:id'

function getGraffitiCallback(req, res)
{

}

// Use this function to add methods to router in other files
module.exports = function(router)
{
  router.get(GET_GRAFFITI_URL, getGraffitiCallback);
}