function PeriodRepository(schema) {
  function normalise(doc) {
    if (!doc) {
      return null;
    }
    return {
      id: doc.id,
      endedAt: doc.endedAt,
      isOpen: doc.isOpen,
      result: doc.result
    };
  }

  this.create = function(data) {
    return new Promise((resolve, reject) => {
      const item = new schema();
      item.createdBy = data.createdBy;
      item.endedAt = data.endedAt;
      item.isOpen = true;
      item.save().then(() => resolve()).catch(reject);
    });
  };

  this.find = function(query) {
    return new Promise((resolve, reject) => {
      schema
        .find(query)
        .then(docs => resolve(docs.map(doc => normalise(doc))))
        .catch(reject);
    });
  };

  this.get_latest = function() {
    return new Promise((resolve, reject) => {
      schema
        .findOne()
        .sort('-createdAt')
        .then(docs => resolve(normalise(docs)))
        .catch(reject);
    });
  };

  this.update = function(id, update) {
    return new Promise((resolve, reject) => {
      schema
        .where({ _id: id })
        .findOne()
        .update(update)
        .setOptions({ runValidators: true })
        .then(info => resolve({ n_modified: info.nModified }))
        .catch(reject);
    });
  };
}

module.exports = PeriodRepository;
