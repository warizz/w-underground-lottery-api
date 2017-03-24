const expect = require('expect');
const request = require('supertest');
const app = require('../server');
// const Period = require('../models/period');
// const User = require('../models/user');

const periods = [
  {
    createdBy: 'someone',
    endedAt: new Date(2017, 4, 1),
  },
];

describe('period', () => {

  describe('POST /period', () => {

    it('should get 401 code', (done) => {
      request(app)
        .post('/api/period')
        .expect(401)
        .end(() => done());
    });

    it('should create an opened period', (done) => {
      request(app)
        .post('/api/period')
        .set('x-access-token', 'xxxx')
        .send(periods[0])
        .expect(201)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body.createdBy).toBe(periods[0].createdBy);
          expect(new Date(res.body.endedAt).getTime()).toBe(periods[0].endedAt.getTime());
          done();
        });
    });

    it('should close the period', (done) => {
      request(app)
        .post('/api/period')
        .set('x-access-token', 'xxxx')
        .send(periods[0])
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body.isOpen).toBe(false);
          done();
        });
    });
  });
});
