function UserRepository(user_schema) {
  function normalise(doc) {
    if (!doc) {
      return null;
    }
    return {
      id: doc.id,
      is_admin: doc.is_admin,
      name: doc.name,
      picture: doc.picture
    };
  }
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
