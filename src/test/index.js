describe('Repository', () => {
  require('./repository/user');
  require('./repository/period');
});
describe('Controller', () => {
  require('./controller/log_in');
  require('./controller/user');
  require('./controller/period');
});
require('./factory');
