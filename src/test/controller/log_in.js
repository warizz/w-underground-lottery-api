const expect = require('expect');
const nock = require('nock');
const { LogInController } = require('../../controller/index');

describe('LogInController', () => {
  // set up mock http response from facebook
  nock('https://graph.facebook.com').get(/\/oauth\/access_token.*/).reply(200, {
    access_token: 'access_token_2'
  });
  nock('https://graph.facebook.com').get(/\/me.*/).reply(200, {
    isAdmin: 'isAdmin',
    name: 'name',
    id: 'id',
    picture: 'picture'
  });

  it('should get 200 status with access_token when call post() with right access_token', (done) => {
    const mock_req = {
      body: {
        access_token: 'access_token_1'
      }
    };
    const mock_res = {
      status(code) {
        expect(code).toBe(200);
        return {
          json(data) {
            expect(data.access_token).toBe('access_token_2');
            done();
          }
        };
      }
    };
    const mock_repository = {
      upsert() {
        return new Promise(resolve =>
          resolve({ access_token: 'access_token_2' })
        );
      }
    };

    const log_in_controller = new LogInController(mock_repository);
    log_in_controller.post(mock_req, mock_res);
  });

  it('should get 401 status when call post() with repository internal error', (done) => {
    const mock_req = {
      body: {
        access_token: 'access_token_1'
      }
    };
    const mock_res = {
      status(code) {
        expect(code).toBe(401);
        return {
          send() {
            done();
          }
        };
      }
    };
    const mock_repository = {
      upsert() {
        return new Promise((resolve, reject) => reject());
      }
    };

    const log_in_controller = new LogInController(mock_repository);
    log_in_controller.post(mock_req, mock_res);
  });
});
