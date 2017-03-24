const expect = require('expect');
const request = require('supertest');
const app = require('../server');
const Period = require('../models/period');
// const User = require('../models/user');

const periods = [
  {
    createdBy: 'awefawefaewfaf',
    endedAt: new Date(2017, 4, 1),
  },
];

describe('period', () => {

  before((done) => {
    Period.remove(() => done());
  });

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
  });

  describe('PATCH /period/:id', () => {
    it('should get 401 code', (done) => {
      request(app)
        .patch('/api/period')
        .expect(401)
        .end(() => done());
    });

    it('should close the period', (done) => {
      Period.findOne({}, (err, doc) => {
        doc.isOpen = false;
        request(app)
          .patch(`/api/period/${doc._id}`)
          .set('x-access-token', 'xxxx')
          .send(doc)
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

  describe('DELETE /period/:id', () => {
    it('should get 401 code', (done) => {
      request(app)
        .patch('/api/period')
        .expect(401)
        .end(() => done());
    });

    it('should delete a period', (done) => {
      Period.findOne({}, (err, doc) => {
        doc.isOpen = false;
        request(app)
          .delete(`/api/period/${doc._id}`)
          .set('x-access-token', 'xxxx')
          .expect(200)
          .end(done);
      });
    });
  })
});
