function UserController(repository) {
  this.authenticate = function(req, res, next) {
    let access_token = req.headers['x-access-token'];
    repository
      .find_by_token(access_token)
      .then((doc) => {
        req.user_id = doc.id;
        next();
      })
      .catch(error => res.status(401).send(error));
  };

  this.get = function(req, res) {
    repository
      .find_by_id(req.user_id)
      .then((user) => {
        if (!user) {
          return res.status(401).send();
        }
        return res.status(200).json(user);
      })
      .catch(error => res.status(500).send(error));
  };
}

module.exports = UserController;
