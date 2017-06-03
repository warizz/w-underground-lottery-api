const { User } = require('../models/index');
const { UserRepository } = require('../repository/index');
const { UserController } = require('../controller/index');

function ControllerFactory() {}

ControllerFactory.prototype = {
  create(name) {
    switch (name) {
    case 'user': {
      const repository = new UserRepository(User);
      return new UserController(repository);
    }
    default:
      throw new Error('Invalid argument: name');
    }
  }
};

module.exports = ControllerFactory;
