const expect = require('expect');
const request = require('supertest');
const app = require('../server');
const { Period } = require('../models/index');

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
      const period = {
        createdBy: 'awefawefaewfaf',
        endedAt: new Date(2017, 4, 1),
      };
      request(app)
        .post('/api/period')
        .set('x-access-token', 'xxxx')
        .send(period)
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

    it('should not create another opened period', (done) => {
      request(app)
        .post('/api/period')
        .set('x-access-token', 'xxxx')
        .send(periods[0])
        .expect(400)
        .end(done);
    });
  });

  describe('GET /period', () => {
    it('should get 401 code', (done) => {
      request(app)
        .post('/api/period')
        .expect(401)
        .end(() => done());
    });

    it('should get latest period', (done) => {
      request(app)
        .get('/api/period')
        .set('x-access-token', 'xxxx')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body).toExist();
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

    it('should save result', (done) => {
      Period.findOne({}, (err, doc) => {
        doc.result = {
          six: '152456',
          two: '20',
          firstThree: '305',
          secondThree: '555',
        };
        request(app)
          .patch(`/api/period/${doc._id}`)
          .set('x-access-token', 'xxxx')
          .send(doc)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.body.result.six).toBe('152456');
            expect(res.body.result.two).toBe('20');
            expect(res.body.result.firstThree).toBe('305');
            expect(res.body.result.secondThree).toBe('555');
            done();
          });
      });
    });
  });
});
