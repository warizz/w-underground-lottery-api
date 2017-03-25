const Period = require('../models/period');

function post(req, res) {
  const period = Object.assign(new Period(), req.body);
  period.createdBy = req.facebookId;
  period.save((err, doc) => {
    if (err) {
      throw err;
    }
    res.status(201).json(doc);
  });
}

function get(req, res) {
  Period.find({ createdBy: req.facebookId }, (err, docs) => {
    if (err) {
      throw err;
    }
    res.status(200).json(docs);
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
