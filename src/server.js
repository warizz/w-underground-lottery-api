require('./config');

const express = require('express');
const mongoose = require('mongoose');
const Promise = require("bluebird");
const bodyParser = require('body-parser');
const cors = require('cors');
const controllers = require('./controllers/index');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

const authenticator = {
  'test': controllers.middleware.fakeAuthenticator,
  'development': controllers.middleware.facebookAuthenticator,
  'production': controllers.middleware.facebookAuthenticator,
};

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(authenticator[process.env.NODE_ENV]);

const router = express.Router();
router.route('/period')
  .get(controllers.period.get)
  .post(controllers.period.post);

router.route('/period/:id')
  .patch(controllers.period.patch);

router.route('/bet')
  .post(controllers.bet.post);

router.route('/bet/:id')
  .patch(controllers.bet.patch)
  .delete(controllers.bet.remove);

router.route('/bets/:periodId')
  .patch(controllers.bets.patch);

router.route('/history')
  .get(controllers.history.get);

app.use('/api', router);
app.use((err, req, res, next) => res.status(400).send(err));
app.listen(process.env.PORT, () => console.log(`app running on port:${process.env.PORT}`));

module.exports = app;
