require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const controllers = require('./controllers/index');
const { ControllerFactory } = require('./factory/index');
const Rollbar = require('rollbar');
const logger = new Rollbar(process.env.ROLLBAR_ACCESS_KEY);

mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const controller_factory = new ControllerFactory();
const user_controller = controller_factory.create('user');
const log_in_controller = controller_factory.create('log_in');
const period_controller = controller_factory.create('period');
const result_controller = controller_factory.create('result');

const router = express.Router();

const FacebookProvider = require('./provider/Facebook');
const FacebookSigninUsecase = require('./usecase/FacebookSignin');
const axios = require('axios');

router.route('/signin').post((req, res) => {
  const { access_token } = req.body;
  logger.debug(`/signin, access_token:${access_token}`);
  const facebookProvider = new FacebookProvider(axios);
  const usecase = new FacebookSigninUsecase(facebookProvider, {});

  try {
    const user = usecase.invoke(access_token);
    res.status(200).json({ access_token: user.access_token });
  } catch (e) {
    logger.error(e);
    res.status(401).send();
  }
});

router
  .route('/bet')
  .all(user_controller.authentication_middleware)
  .post(controllers.bet.post);

router
  .route('/bet/:id')
  .all(user_controller.authentication_middleware)
  .patch(controllers.bet.patch)
  .delete(controllers.bet.remove);

router
  .route('/bets/:periodId')
  .all(user_controller.authentication_middleware)
  .patch(controllers.bets.patch)
  .post(controllers.bets.post);

router
  .route('/history')
  .all(user_controller.authentication_middleware)
  .get(controllers.history.get);

router
  .route('/me')
  .all(user_controller.authentication_middleware)
  .get(user_controller.get);

router.route('/log_in').post(log_in_controller.post);

router
  .route('/log_out')
  .all(user_controller.authentication_middleware)
  .patch(controllers.user.logOut);

router
  .route('/period')
  .all(user_controller.authentication_middleware)
  .get(controllers.period.get)
  .post(controllers.period.post);

router
  .route('/period/:id')
  .all(user_controller.authentication_middleware)
  .patch(controllers.period.patch);

router
  .route('/summary/:period_id')
  .all(user_controller.authentication_middleware)
  .get(controllers.summary.get);

router
  .route('/periods/:query_type')
  .all(user_controller.authentication_middleware)
  .post(period_controller.post)
  .patch(period_controller.patch);

router.route('/results').post(result_controller.post);

app.use('/api', router);
app.listen(process.env.PORT);

module.exports = app;
