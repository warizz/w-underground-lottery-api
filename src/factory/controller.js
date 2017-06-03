const { User } = require('../models/index');
const { UserRepository } = require('../repository/index');
const { LogInController, UserController } = require('../controller/index');

function ControllerFactory() {}

ControllerFactory.prototype = {
  create(name) {
    switch (name) {
    case 'user': {
      const repository = new UserRepository(User);
      return new UserController(repository);
    }
    case 'log_in': {
      const user_repository = new UserRepository(User);
      return new LogInController(user_repository);
    }
    default:
      throw new Error('Invalid argument: name');
    }
  }
};

module.exports = ControllerFactory;
