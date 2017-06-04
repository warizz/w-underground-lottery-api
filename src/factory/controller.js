const { Period, User } = require('../models/index');
const { PeriodRepository, UserRepository } = require('../repository/index');
const {
  LogInController,
  PeriodController,
  UserController
} = require('../controller/index');

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
    case 'period': {
      const period_repository = new PeriodRepository(Period);
      const user_repository = new UserRepository(User);
      return new PeriodController(period_repository, user_repository);
    }
    default:
      throw new Error('Invalid argument: name');
    }
  }
};

module.exports = ControllerFactory;
