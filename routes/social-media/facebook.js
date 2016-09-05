'use strict';

let FacebookClient = require('../../libs/social-media/facebook/facebook-client');

const FB_LOGIN_PATH = '/fb-login'
const FB_REDIRECT_PATH = '/fb-redirect';
const FB_SHARE_PATH = '/fb-share'

function facebookLogin(req, res) {
  let loginUrl = FacebookClient.getFacebookLoginUrl();
  res.redirect(loginUrl);
}

function facebookShare(req, res) {
  let shareUrl = FacebookClient.generateShareUrl();
  res.redirect(shareUrl);
}

function facebookRetrieveAccessToken(req, res) {
  let code = req.query.code;
  FacebookClient
    .associateAccessTokenWithSession(code, req.session)
      .then(() => {  res.send('winner'); })
      .catch((error) => { res.send(error); });
}

module.exports = function (router) {
  router.get(FB_LOGIN_PATH, facebookLogin);
  router.get(FB_SHARE_PATH, facebookShare);
  router.get(FB_REDIRECT_PATH, facebookRetrieveAccessToken);
}
