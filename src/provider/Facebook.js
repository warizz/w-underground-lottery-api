class FacebookProvider {
  constructor(httpRequest) {
    this.httpRequest = httpRequest;
  }

  getAccessToken(fb_exchange_token) {
    const config = {
      baseURL: 'https://graph.facebook.com',
      url: '/oauth/access_token',
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        fb_exchange_token,
      },
    };
    return this.httpRequest.request(config).then(res => res.data.access_token);
  }

  getUserProfile(access_token) {
    const config = {
      baseURL: 'https://graph.facebook.com',
      url: '/me',
      params: {
        fields: 'name,picture',
        access_token,
      },
    };
    return this.httpRequest.request(config).then(res => res.data);
  }
}

module.exports = FacebookProvider;
