'use strict';

let facebookClient = require('../../libs/social-media/facebook/facebook');

const FB_REDIRECT_PATH = '/fb-redirect';

function facebookLogin(req, res) {
  let loginUrl = facebookClient.getFacebookLoginUrl();
  res.redirect(loginUrl);
}

function facebookRetrieveAccessToken(req, ress) {
  let code = req.query.code
  facebookClient
    .associateRequestTokenWithSession(code, req.session)
    .then(() => {  res.send(req.session); })
    .catch((error) => { res.send(error); });
}

module.exports = function (router) {
  router.get(FB_REDIRECT_PATH, (req, res) => {});
}
