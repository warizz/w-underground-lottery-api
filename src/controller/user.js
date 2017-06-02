function UserController(user_repository) {
  return {
    get(req, res) {
      user_repository
        .find_by_id(req.user_id)
        .then((user) => {
          if (!user) {
            return res.status(401).send();
          }
          return res.status(200).json(user);
        })
        .catch(error => res.status(500).send(error));
    }
  };
}

module.exports = UserController;
