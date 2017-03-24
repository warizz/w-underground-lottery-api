const https = require('https');

function facebookAuthenticator(req, res, next) {
  let token = req.headers['x-access-token'];
  const url = `https://graph.facebook.com/me?fields=id&access_token=${token}`;
  https.get(url, (fbRes) => {
    if (fbRes.statusCode === 400) {
      res.status(401).send();
      return;
    }
    let body = '';
    fbRes.on('data', function(chunk) {
      body += chunk;
    });
    fbRes.on('end', function() {
      req.facebookId = JSON.parse(body).id;
      next();
    });
  });
}

function fakeAuthenticator(req, res, next) {
  let token = req.headers['x-access-token'];
  if (token) {
    req.facebookId = 'awefawefaewfaf';
    next();
    return;
  }
  res.status(401).send();
  return;
}

module.exports = {
  facebookAuthenticator,
  fakeAuthenticator,
};
