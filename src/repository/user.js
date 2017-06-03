function UserRepository(user_schema) {
  function normalise(doc) {
    if (!doc) {
      return null;
    }
    return {
      id: doc.id,
      access_token: doc.access_token,
      is_admin: doc.is_admin,
      name: doc.name,
      picture: doc.picture
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
                { access_token: user_data.access_token },
                { new: true }
              )
              .then(updated_doc => resolve(normalise(updated_doc)))
              .catch(reject);
            return;
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
    return new Promise((resolve, reject) => {
      user_schema.findById(id).then(normalise).then(resolve).catch(reject);
    });
  };

  this.find_by_token = function(access_token) {
    return new Promise((resolve, reject) => {
      user_schema
        .where({ access_token })
        .findOne()
        .then(normalise)
        .then(resolve)
        .catch(reject);
    });
  };
}

module.exports = UserRepository;
