const { Bet } = require('../models/index');

function patch(req, res, next) {
  Bet.update({ _period: req.params.periodId }, { isPaid: req.body.isPaid }, { multi: true }, (error) => {
    if (error) {
      return next(error);
    }
    res.status(200).send();
  });
}

module.exports = {
  patch,
};
