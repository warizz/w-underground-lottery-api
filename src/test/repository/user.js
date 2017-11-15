// const expect = require('expect');
// const { User } = require('../../models/index');
// const { UserRepository } = require('../../repository/index');
//
// describe('User', function() {
//   this.timeout(120000); // for mockgoose
//   const mongoose = require('mongoose');
//   const Promise = require('bluebird');
//   mongoose.Promise = Promise;
//   let _user = {};
//
//   before((done) => {
//     const Mockgoose = require('mockgoose').Mockgoose; // eslint-disable-line node/no-unpublished-require
//     const mockgoose = new Mockgoose(mongoose);
//     mockgoose.prepareStorage().then(() => {
//       mongoose.connect(
//         'mongodb://localhost:4000/underground_lottery_unit_test',
//         done
//       );
//     });
//   });
//
//   it('should get an error when process.env.ALLOW_NEW_USER === false', (done) => {
//     const user_data = {
//       access_token: 'access_token',
//       name: 'name',
//       oauth_id: 'oauth_id',
//       picture: {
//         data: {
//           url: 'url',
//         },
//       },
//     };
//     const user_repository = new UserRepository(User);
//     user_repository.upsert(user_data).catch((error) => {
//       expect(error.message).toEqual('New user not allowed');
//       done();
//     });
//   });
//
//   it('should get data when call upsert() with correct data (insert)', (done) => {
//     process.env.ALLOW_NEW_USER = true;
//     const user_data = {
//       access_token: 'access_token',
//       name: 'name',
//       oauth_id: 'oauth_id',
//       picture: {
//         data: {
//           url: 'url',
//         },
//       },
//     };
//     const user_repository = new UserRepository(User);
//     user_repository
//       .upsert(user_data)
//       .then((res) => {
//         expect(res).toExist();
//         done();
//       })
//       .catch(done);
//   });
//
//   it('should get data when call upsert() with correct data (update)', (done) => {
//     const user_data = {
//       access_token: 'access_token',
//       name: 'name',
//       oauth_id: 'oauth_id',
//       picture: {
//         data: {
//           url: 'url',
//         },
//       },
//     };
//     const user_repository = new UserRepository(User);
//     user_repository
//       .upsert(user_data)
//       .then((res) => {
//         expect(res).toExist();
//         _user = res;
//         done();
//       })
//       .catch(done);
//   });
//
//   it('should get data when call find_by_token() with correct input', (done) => {
//     const user_repository = new UserRepository(User);
//     user_repository
//       .find_by_token('access_token')
//       .then((res) => {
//         expect(res).toExist();
//         done();
//       })
//       .catch(done);
//   });
//
//   it('should get data when call find_by_id() with correct input', (done) => {
//     const user_repository = new UserRepository(User);
//     user_repository
//       .find_by_id(_user.id)
//       .then((res) => {
//         expect(res).toExist();
//         done();
//       })
//       .catch(done);
//   });
//
//   it('should not get data when call find_by_id() with incorrect input', (done) => {
//     const user_repository = new UserRepository(User);
//     user_repository
//       .find_by_token('xxx')
//       .then((res) => {
//         expect(res).toNotExist();
//         done();
//       })
//       .catch(done);
//   });
//
//   after(() => {
//     mongoose.connection.close();
//   });
// });
