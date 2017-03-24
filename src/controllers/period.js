const Log = require('../models/period');

function post(req, res) {
  const log = Object.assign(new Log(), req.body);
  log.createdBy = req.facebookId;
  log.save((err, doc) => {
    if (err) {
      throw err;
    }
    res.status(201).json(doc);
  });
}

function get(req, res) {
  Log.find({ createdBy: req.facebookId }, (err, docs) => {
    if (err) {
      throw err;
    }
    res.status(200).json(docs);
  });
}

function patch(req, res) {
  Log.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
    if (err) {
      throw err;
    }
    res.status(200).json(doc);
  });
}

function remove(req, res) {
  Log.findByIdAndRemove(req.params.id, (err, doc) => {
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
  remove,
};
