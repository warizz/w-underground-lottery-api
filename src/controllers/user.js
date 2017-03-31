const axios = require('axios');
const { User } = require('../models/index');

const FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.facebook.com';

function facebookAuthenticator(short_lived_token) {
  const params = `/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${short_lived_token}`;
  const endpoint = `${FACEBOOK_GRAPH_API_BASE_URL}${params}`;
  return new Promise((resolve, reject) => {
    axios
      .get(endpoint)
      .then(res => resolve(res.data.access_token))
      .catch(error => reject(error.response.data));
  });
}

function fakeAuthenticator(access_token) {
  return new Promise((resolve, reject) => {
    if (!access_token) {
      reject('invalid token');
      return;
    }
    resolve(access_token);
  });
}

function getToken(authenticator, short_lived_token) {
  return authenticator(short_lived_token);
}

function get(req, res) {
  console.log("get() user_id", req.user_id)
  User
    .findById(req.user_id)
    .select('isAdmin name picture')
    .exec((error, doc) => {
      console.log('error', error)
      if (error) {
        return res.status(400).send();
      }
      if (!doc) {
        return res.status(401).send();
      }
      return res.status(200).json(doc);
    });
}

function facebookProfileGetter(access_token) {
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
      .catch(error => reject(error));
  });
}

function fakeProfileGetter(access_token) {
  return new Promise((resolve) => {
    resolve({
      access_token,
      isAdmin: false,
      name: 'tester testerer',
      oauth_id: 'awefawefaewfaf',
      picture: {
        data: {
          url: 'https://scontent.fbkk1-4.fna.fbcdn.net/v/t1.0-9/13151495_10153419716527676_5289925877114749609_n.jpg',
        },
      },
    });
  });
}

function logOut(access_token) {
  return new Promise((resolve, reject) => {
    User
      .where({ access_token })
      .findOne()
      .remove((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
  });
}

function normalize(user) {
  return {
    name: user.name,
    picture: user.picture,
    access_token: user.access_token,
  };
}

function post(req, res) {
  const access_token = req.body.access_token;
  const authenticator = process.env.NODE_ENV === 'test' ? fakeAuthenticator : facebookAuthenticator;
  const profileGetter = process.env.NODE_ENV === 'test' ? fakeProfileGetter : facebookProfileGetter;
  getToken(authenticator, access_token)
    .then(profileGetter)
    .then(saveUserData)
    .then(user => res.status(200).json(normalize(user)))
    .catch(error => res.status(401).send(error));
}

function saveUserData(user_data) {
  return new Promise((resolve, reject) => {
    User
      .where({ oauth_id: user_data.oauth_id })
      .findOne()
      .exec((error, doc) => {
        if (error) {
          return reject(error);
        }
        if (doc) {
          User
            .findByIdAndUpdate(doc._id, { access_token: user_data.access_token }, { new: true }, (updated_error, updated_doc) => {
              if (updated_error) {
                return reject(updated_error);
              }
              return resolve(updated_doc);
            });
          return;
        }
        const user = new User();
        user.name = user_data.name;
        user.picture = user_data.picture.data.url;
        user.access_token = user_data.access_token;
        user.oauth_id = user_data.oauth_id;
        user.save((save_error, new_doc) => {
          if (save_error) {
            return reject(save_error);
          }
          return resolve(new_doc);
        });
      });
  });
}

function validateToken(access_token) {
  return new Promise((resolve, reject) => {
    User
      .where({ access_token })
      .findOne()
      .select('id')
      .exec((error, doc) => {
        if (error) {
          return reject(error);
        }
        if (!doc) {
          return reject('invalid token');
        }
        return resolve(doc.id);
      });
  });
}

module.exports = {
  facebookAuthenticator,
  facebookProfileGetter,
  fakeAuthenticator,
  fakeProfileGetter,
  get,
  getToken,
  logOut,
  post,
  saveUserData,
  validateToken,
};
