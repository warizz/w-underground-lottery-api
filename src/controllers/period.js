const Period = require('../models/period');

function post(req, res, next) {
  Period.findOne({ isOpen: true }, (error, doc) => {
    if (error) {
      return next(error);
    }
    if (doc) {
      return next(new Error('There is another openning period'));
    }
    const period = Object.assign(new Period(), req.body);
    period.createdBy = req.facebookId;
    period.save((error, doc) => {
      if (error) {
        return next(error);
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
      match: { createdBy: req.facebookId },
      path: 'bets',
      select: '-createdAt -createdBy -period -__v'
    })
    .select('-createdAt -createdBy -__v ')
    .exec((error, doc) => {
      if (error) {
        return next(error);
      }
      res.status(200).json(doc);
    });
}

function patch(req, res) {
  Period.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
    if (err) {
      throw err;
    }
    res.status(200).json(doc);
  });
}

module.exports = {
  get,
  patch,
  post,
};
