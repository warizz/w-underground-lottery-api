function UserRepository(user_schema) {
  function normalise(doc) {
    return {
      id: doc.id,
      is_admin: doc.is_admin,
      name: doc.name,
      picture: doc.picture
    };
  }
  this.find_by_id = function(id) {
    return new Promise((resolve, reject) => {
      user_schema
        .findById(id)
        .then((doc) => {
          if (!doc) {
            return resolve();
          }
          const normalised = normalise(doc);
          resolve(normalised);
        })
        .catch(reject);
    });
  };
}

module.exports = UserRepository;
