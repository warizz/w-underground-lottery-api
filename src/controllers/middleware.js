const { validateToken } = require('./user');

function facebookAuthenticator(req, res, next) {
  let access_token = req.headers['x-access-token'];
  validateToken(access_token)
    .then((user_id) => {
      req.user_id = user_id;
      next();
    })
    .catch(() => res.status(401).send());
}

function fakeAuthenticator(req, res, next) {
  let token = req.headers['x-access-token'];
  if (token) {
    req.user_id = 'awefawefaewfaf';
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
