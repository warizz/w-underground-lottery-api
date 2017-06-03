const expect = require('expect');
const ControllerFactory = require('../factory/controller');
const { UserController } = require('../controller/index');

describe('Factory', () => {
  describe('ControllerFactory', () => {
    let controller_factory = new ControllerFactory();
    it('should get UserController when call create("user")', (done) => {
      const user_controller = controller_factory.create('user');
      expect(user_controller instanceof UserController).toBe(true);
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
