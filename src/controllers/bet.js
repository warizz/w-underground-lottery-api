const { Bet, Period } = require('../models/index');

function get(req, res, next) {
  Period.findOne().sort({ createdAt: -1 }).populate('bets').exec((error, doc) => {
    if (error) {
      return next(error);
    }
    res.status(200).json(doc);
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

module.exports = {
  get,
  post,
};
