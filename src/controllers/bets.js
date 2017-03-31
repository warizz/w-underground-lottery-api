const { Bet, Period } = require('../models/index');

function patch(req, res, next) {
  Bet
    .where('period').eq(req.params.periodId)
    .where(req.body.query)
    .setOptions({ multi: true })
    .update(req.body.update)
    .exec((error) => {
      if (error) return next(error);
      res.status(200).send();
    });
}

function post(req, res, next) {
  const inputBets = req.body.map((inputBet) => {
    delete inputBet._id;
    delete inputBet.id;
    inputBet.createdBy = req.user_id;
    inputBet.period = req.params.periodId;
    return inputBet;
  });
  Bet.insertMany(inputBets, (error, docs)=> {
    if (error) {
      return next(error);
    }
    const bets = docs.map(d => d._id);
    Period.findByIdAndUpdate(req.params.periodId, { $pushAll: { bets } }, { new: true }, (error2) => {
      if (error2) {
        return next(error2);
      }
      res.status(201).send();
    });
  });
}

module.exports = {
  patch,
  post,
};
