const Period = require('../models/period');

function get(req, res, next) {
  Period
    .find()
    .sort('-createdAt')
    .limit(10)
    .populate({
      match: { createdBy: req.facebookId },
      path: 'bets',
      select: 'id createdBy number price1 price2 price3',
    })
    .select('id createdAt endedAt bets')
    .exec((error, docs) => {
      if (error) {
        return next(error);
      }
      res.status(200).json(docs);
    });
}

module.exports = {
  get,
};
