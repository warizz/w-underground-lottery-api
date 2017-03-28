const axios = require('axios');
const { User } = require('../models/index');

const FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.facebook.com';

function facebookAuthenticator(short_lived_token) {
  const params = `/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${short_lived_token}`;
  const endpoint = `${FACEBOOK_GRAPH_API_BASE_URL}${params}`;
  return new Promise((resolve, reject) => {
    axios
      .get(endpoint)
      .then((res) => {
        resolve(res.access_token);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

function fakeAuthenticator(access_token) {
  return new Promise((resolve) => {
    resolve(access_token);
  });
}

function getToken(authenticator, short_lived_token) {
  return authenticator(short_lived_token);
}

function facebookProfileGetter(access_token) {
  const params = `/me?fields=name,picture&access_token=${access_token}`;
  const endpoint = `${FACEBOOK_GRAPH_API_BASE_URL}${params}`;
  return new Promise((resolve, reject) => {
    axios
      .get(endpoint)
      .then((res) => {
        const user = {
          name: res.data.name,
          picture: res.data.picture,
          id: res.data.id,
          access_token,
        };
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function fakeProfileGetter(access_token) {
  return new Promise((resolve) => {
    resolve({
      name: 'tester testerer',
      picture: 'https://scontent.fbkk1-4.fna.fbcdn.net/v/t1.0-9/13151495_10153419716527676_5289925877114749609_n.jpg',
      id: '15879532356898',
      access_token,
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
        }
        resolve();
      });
  });
}

function saveUserData(user_data) {
  const user = new User();
  user.name = user_data.name;
  user.picture = user_data.picture;
  user.access_token =user_data.access_token;
  return new Promise((resolve, reject) => {
    user.save((error, doc) => {
      if (error) {
        reject(error);
      }
      resolve(doc);
    });
  });
}

function validateToken(access_token) {
  return new Promise((resolve, reject) => {
    User
      .where({ access_token })
      .findOne()
      .select('name picture id access_token')
      .exec((error, doc) => {
        if (error) {
          reject(error);
        }
        resolve(doc);
      });
  });
}

module.exports = {
  facebookAuthenticator,
  facebookProfileGetter,
  fakeAuthenticator,
  fakeProfileGetter,
  getToken,
  logOut,
  saveUserData,
  validateToken,
};
