'use strict';

let twitterClient = require('../../libs/social-media/twitter/twitter');

let bodyParser = require('body-parser')
let jsonParser = bodyParser.json();

const GET_OAUTH_PARAMS_PATH = '/retrieve-twitter-token';
const TWEET_IMAGE_PATH = '/tweet-image';

function tweetImage(req, res) {
  twitterClient
    .makeTweetWithImage(
      'I hope this works too', 
      'https://i.imgur.com/Y9rP9eks.jpg',
       req.session)
        .then(() => { res.send('OH YEAH!'); })
        .catch((error) => { res.send('ERROR' + error); });
}


module.exports = function (router) {
  router.get(GET_OAUTH_PARAMS_PATH, tieAccessTokenToSession);
  router.get(TWEET_IMAGE_PATH, tweetImage);
}

