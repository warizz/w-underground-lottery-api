function PeriodController(period_repository, user_repository, bet_repository) {
  this.get = function(req, res) {
    user_repository.find_by_id(req.user_id).then((user) => {
      const { query_type } = req.params;

      switch (query_type) {
      case 'latest':
        if (!req.query.user && !user.is_admin) {
          return res.status(401).send();
        }

        period_repository.get_latest().then((period) => {
          if (!period) {
            return res.status(200).json();
          }

          const bet_query = {};
          bet_query.period = period.id;
          if (req.query.user) {
            bet_query.createdBy = req.query.user;
          }

          bet_repository.find(bet_query).then((bets) => {
            period.bets = bets;
            return res.status(200).json(period);
          });
        });

        break;
      default:
        return res
          .status(400)
          .send(new Error('Invalid argument: query_type'));
      }
    });
  };

  this.patch = function(req, res) {
    if (!req.user_id) {
      return res.status(401).send();
    }
    if (req.params.query_type !== 'latest') {
      return res.status(400).send(new Error('Invalid argument: query_type'));
    }

    user_repository.find_by_id(req.user_id).then((user) => {
      if (!user.is_admin) {
        return res.status(401).send();
      }

      period_repository.get_latest().then((period) => {
        if (!period) {
          return res
            .status(400)
            .send(new Error('Invalid operation: period not found'));
        }

        if (period.isOpen) {
          return res
            .status(400)
            .send(new Error('Invalid operation: period is openning'));
        }

        if (
          Object.keys(req.body).length === 0 &&
          req.body.constructor === Object
        ) {
          return res
            .status(400)
            .send(new Error('Invalid argument: request body is empty'));
        }

        const data = {};
        const { isOpen, result } = req.body;
        if (typeof isOpen === 'boolean') {
          data.isOpen = isOpen;
        }
        if (result) {
          data.result = result;
        }

        period_repository
          .update(period.id, data)
          .then((info) => {
            if (info.n_modified === 1) {
              return res.status(200).json(info);
            }
            return res
              .status(400)
              .send(new Error('Invalid operation: period was not updated'));
          })
          .catch((exception) => {
            const { errors = [] } = exception;
            const validator_errors = errors.filter(
              error => error.name === 'ValidatorError'
            );
            if (validator_errors.length > 0) {
              return res
                .status(400)
                .send(new Error('Invalid argument: result'));
            }
            res.status(500).send(exception);
          });
      });
    });
  };

  this.post = function(req, res) {
    user_repository.find_by_id(req.user_id).then((user) => {
      if (!user.is_admin) {
        return res.status(401).send();
      }

      period_repository.find({ isOpen: true }).then((docs) => {
        if (docs.length > 0) {
          return res
            .status(400)
            .send(new Error('Invalid operation: other period is openning'));
        }

        const data = {
          endedAt: req.body.endedAt,
          createdBy: req.user_id
        };
        period_repository
          .create(data)
          .then(() => {
            return res.status(201).send();
          })
          .catch(error => res.status(500).send(error));
      });
    });
  };
}

module.exports = PeriodController;
