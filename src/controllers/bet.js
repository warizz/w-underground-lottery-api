const { Bet, Period } = require('../models/index');

function get(req, res, next) {
  Period
    .findOne()
    .sort('-createdAt')
    .populate({
      match: { createdBy: req.facebookId },
      path: 'bets',
      select: 'id isPaid number price1 price2 price3',
    })
    .select('id endedAt isOpen bets')
    .exec((error, doc) => {
      if (error) {
        return next(error);
      }
      res.status(200).json(doc.toJSON());
    });
}

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
  bet.createdBy = req.facebookId;
  delete bet.id;
  delete bet.period;
  bet.save((error, doc) => {
    if (error) {
      return next(error);
    }
    Period.findByIdAndUpdate(bet._period, { $push: { bets: bet._id } }, { new: true }, (error2) => {
      if (error2) {
        return next(error2);
      }
      res.status(201).json(doc);
    });
  });
}

function remove(req, res, next) {
  Bet.findByIdAndRemove(req.params.id, { select: '_period' }, (error, doc) => {
    if (error) {
      return next(error);
    }
    Period.findByIdAndUpdate(doc._period, { $pull: { bets: req.params.id } }, (error2) => {
      if (error2) {
        return next(error);
      }
      res.status(200).send();
    });
  });
}

module.exports = {
  get,
  patch,
  post,
  remove,
};
