const { Period, User } = require('../models/index');
const { PeriodRepository, UserRepository } = require('../repository/index');
const { ResultManager } = require('../manager/index');
const {
  LogInController,
  PeriodController,
  UserController,
  ResultController,
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
    case 'result': {
      const period_repository = new PeriodRepository(Period);
      const result_manager = new ResultManager(period_repository);
      return new ResultController(result_manager);
    }
    default:
      throw new Error('Invalid argument: name');
    }
  },
};

module.exports = ControllerFactory;
