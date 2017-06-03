const expect = require('expect');
const ControllerFactory = require('../factory/controller');
const { LogInController, UserController } = require('../controller/index');

describe('Factory', () => {
  describe('Controller', () => {
    let controller_factory = new ControllerFactory();

    it('should get UserController when call create("user")', (done) => {
      const user_controller = controller_factory.create('user');
      expect(user_controller instanceof UserController).toBe(true);
      done();
    });

    it('should get LogInController when call create("log_in")', (done) => {
      const controller = controller_factory.create('log_in');
      expect(controller instanceof LogInController).toBe(true);
      done();
    });

    it('should get "Invalid argument: name" when call create("xxx")', (done) => {
      try {
        controller_factory.create('xxx');
      } catch (error) {
        expect(error.message).toBe('Invalid argument: name');
        done();
      }
    });
  });
});
