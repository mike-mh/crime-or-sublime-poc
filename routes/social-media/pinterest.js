'use strict';

let PinterestClient = require('../../libs/social-media/reddit/pinterest-client');

const PINTEREST_REDIRECT_URI = 'pinterest-redirect';

/**
 * Use this function to generate the window which allows users to post pins to
 * Pinterest. If the user isn't logged in the generated URL will direct the
 * user to the login page and then back to the 'pin' page finally back to CoS.
 */
function renderPinterestCreatePinWindow(req, res) {
  
}
