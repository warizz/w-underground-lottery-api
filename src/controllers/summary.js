const Period = require('../models/period');

function get(req, res, next) {
  Period
    .findById(req.params.period_id)
    .sort('-createdAt')
    .populate({
      path: 'bets',
      model: 'Bet',
      populate: {
        path: 'createdBy',
        model: 'User',
        select: 'id name',
      },
      select: 'id createdBy isPaid number price1 price2 price3',
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
