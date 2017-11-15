const axios = require('axios');

function LogInController(user_repository) {
  const FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.facebook.com';

  function _get_facebook_profile(access_token) {
    const params = `/me?fields=name,picture&access_token=${access_token}`;
    const endpoint = `${FACEBOOK_GRAPH_API_BASE_URL}${params}`;
    return new Promise((resolve, reject) => {
      axios
        .get(endpoint)
        .then((res) => {
          const user = {
            access_token,
            isAdmin: res.data.isAdmin,
            name: res.data.name,
            oauth_id: res.data.id,
            picture: res.data.picture,
          };
          resolve(user);
        })
        .catch(reject);
    });
  }

  function _get_facebook_token(short_lived_token) {
    const params = `/oauth/access_token?grant_type=fb_exchange_token&client_id=${process
      .env.FACEBOOK_APP_ID}&client_secret=${process.env
      .FACEBOOK_APP_SECRET}&fb_exchange_token=${short_lived_token}`;
    const endpoint = `${FACEBOOK_GRAPH_API_BASE_URL}${params}`;
    return new Promise((resolve, reject) => {
      axios
        .get(endpoint)
        .then(res => resolve(res.data.access_token))
        .catch(reject);
    });
  }

  this.post = function(req, res) {
    _get_facebook_token(req.body.access_token)
      .then(_get_facebook_profile)
      .then(user_repository.upsert)
      .then(user => res.status(200).json({ access_token: user.access_token }))
      .catch(error => res.status(401).send(error));
  };
}

module.exports = LogInController;
