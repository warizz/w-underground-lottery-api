function PeriodController(period_repository, user_repository, bet_repository) {
  this.get = function(req, res) {
    user_repository.find_by_id(req.user_id).then((user) => {
      const { query_type } = req.params;

      switch (query_type) {
      case 'latest':
        if (!req.query.user && !user.isAdmin) {
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

  this.post = function(req, res) {
    user_repository.find_by_id(req.user_id).then((user) => {
      if (!user.isAdmin) {
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
