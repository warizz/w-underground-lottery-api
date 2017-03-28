const { Bet, Period } = require('../models/index');

function patch(req, res, next) {
  Bet.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, doc) => {
    if (error) {
      return next(error);
    }
    res.status(200).send(doc);
  });
}

function post(req, res, next) {
  if (
    (!req.body.price1 && !req.body.price2 && !req.body.price3) ||
    (req.body.price1 === 0 && req.body.price2 === 0 && req.body.price3 === 0)
  ) {
    return next({ message: 'Bet validation failed' });
  }
  const bet = Object.assign(new Bet(), req.body);
  bet.createdBy = req.user_id;
  delete bet.id;
  delete bet.period;
  bet.save((error, doc) => {
    if (error) {
      return next(error);
    }
    Period.findByIdAndUpdate(bet.period, { $push: { bets: bet._id } }, { new: true }, (error2) => {
      if (error2) {
        return next(error2);
      }
      res.status(201).json(doc);
    });
  });
}

function remove(req, res, next) {
  Bet.findByIdAndRemove(req.params.id, { select: 'period' }, (error, doc) => {
    if (error) {
      return next(error);
    }
    Period.findByIdAndUpdate(doc.period, { $pull: { bets: req.params.id } }, (error2) => {
      if (error2) {
        return next(error);
      }
      res.status(200).send();
    });
  });
}

module.exports = {
  patch,
  post,
  remove,
};
