function UserRepository(user_schema) {
  function mapToModel(doc) {
    return {
      id: doc.id,
      is_admin: doc.is_admin,
      name: doc.name,
      picture: doc.picture
    };
  }
  return {
    find_by_id(id) {
      return new Promise((resolve, reject) => {
        user_schema
          .findById(id)
          .then((doc) => {
            if (!doc) {
              return resolve();
            }
            const mapped = mapToModel(doc);
            resolve(mapped);
          })
          .catch(reject);
      });
    }
  };
}

module.exports = UserRepository;
