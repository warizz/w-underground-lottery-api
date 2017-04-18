const Period = require('../models/period');

function patch(req, res, next) {
  Period.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, doc) => {
    if (error) {
      return next(error);
    }
    res.status(200).json(doc);
  });
}

function post(req, res, next) {
  Period.findOne({ isOpen: true }, (error, doc) => {
    if (error) {
      return next(error);
    }
    if (doc) {
      return next(new Error('There is another openning period'));
    }
    const period = Object.assign(new Period(), req.body);
    period.createdBy = req.user_id;
    period.save((error, doc) => {
      if (error) {
        return next(error.message);
      }
      res.status(201).json(doc);
    });
  });
}

function get(req, res, next) {
  Period
    .findOne()
    .sort('-createdAt')
    .populate({
      match: { createdBy: req.user_id },
      path: 'bets',
      select: 'createdAt createdBy id isPaid number price1 price2 price3',
    })
    .select('id createdAt endedAt isOpen bets result')
    .exec((error, doc) => {
      if (error) {
        return next(error);
      }
      res.status(200).json(doc ? doc.toJSON() : doc);
    });
}

module.exports = {
  get,
  patch,
  post,
};
