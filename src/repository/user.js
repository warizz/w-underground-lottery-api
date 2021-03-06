function UserRepository(user_schema) {
  function normalise(doc) {
    if (!doc) {
      return null;
    }
    return {
      access_token: doc.access_token,
      id: doc.id,
      is_admin: doc.is_admin,
      name: doc.name,
      picture: doc.picture,
    };
  }

  this.upsert = function(user_data) {
    return new Promise((resolve, reject) => {
      user_schema
        .where({ oauth_id: user_data.oauth_id })
        .findOne()
        .then((doc) => {
          if (doc) {
            user_schema
              .findByIdAndUpdate(
                doc._id,
                {
                  access_token: user_data.access_token,
                  name: user_data.name,
                  picture: user_data.picture.data.url,
                },
                { new: true }
              )
              .then(updated_doc => resolve(normalise(updated_doc)))
              .catch(reject);
            return;
          }

          if (!process.env.ALLOW_NEW_USER) {
            return Promise.reject(new Error('New user not allowed'));
          }

          const user = new user_schema();
          user.access_token = user_data.access_token;
          user.name = user_data.name;
          user.oauth_id = user_data.oauth_id;
          user.picture = user_data.picture.data.url;
          user
            .save()
            .then(new_doc => resolve(normalise(new_doc)))
            .catch(reject);
        })
        .catch(reject);
    });
  };

  this.find_by_id = function(id) {
    return user_schema.findById(id).then(normalise);
  };

  this.find_by_token = function(access_token) {
    return user_schema
      .where({ access_token })
      .findOne()
      .then(normalise);
  };
}

module.exports = UserRepository;
