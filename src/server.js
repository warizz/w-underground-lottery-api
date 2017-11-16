require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const controllers = require('./controllers/index');
const { ControllerFactory } = require('./factory/index');
const Rollbar = require('rollbar');
const logger = new Rollbar(process.env.LOGGER_ACCESS_KEY);
logger.configure({ logLevel: process.env.LOGGER_LOG_LEVEL });

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

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
const MeUsecase = require('./usecase/Me');
const { User } = require('./models/index');
const { UserRepository } = require('./repository/index');
const axios = require('axios');

router.route('/signin').post(async (req, res) => {
  const short_lived_token = req.body.access_token;
  const facebookProvider = new FacebookProvider(axios);
  const userRepository = new UserRepository(User);
  const usecase = new FacebookSigninUsecase(facebookProvider, userRepository);

  try {
    const access_token = await usecase.invoke(short_lived_token);
    if (!access_token) {
      return res.status(401).send();
    }
    return res.status(200).json({ access_token });
  } catch (e) {
    logger.error(e);
    return res.status(500).send();
  }
});

router
  .route('/me')
  .all(user_controller.authentication_middleware)
  .get(async (req, res) => {
    const { user_id } = req;
    const userRepository = new UserRepository(User);
    const usecase = new MeUsecase(userRepository);

    try {
      const user = await usecase.invoke(user_id);
      if (!user) {
        return res.status(401).send();
      }
      return res.status(200).json(user);
    } catch (e) {
      logger.error(e);
      return res.status(500).send();
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
