/**
 * To get requester's information
 */
class MeUsecase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async invoke(user_id) {
    return await this.userRepository.find_by_id(user_id);
  }
}

module.exports = MeUsecase;
