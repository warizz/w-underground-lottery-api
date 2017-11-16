/**
 * To get requester's information
 */
class MeUsecase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  invoke(user_id) {
    return this.userRepository.find_by_id(user_id);
  }
}

module.exports = MeUsecase;
