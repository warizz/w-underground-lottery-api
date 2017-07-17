function ResultController(result_manager) {
  this.post = function(req, res) {
    result_manager
      .update()
      .then(() => res.status(200).send())
      .catch(error => res.status(500).send(error));
  };
}

module.exports = ResultController;
