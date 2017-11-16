/**
 * To get Facebook access token and store user data
 */
class FacebookSigninUsecase {
  constructor(facebookProvider, userRepository) {
    this.facebookProvider = facebookProvider;
    this.userRepository = userRepository;
  }

  async invoke(short_lived_token) {
    const access_token = await this.facebookProvider.getAccessToken(short_lived_token);
    const user_profile = await this.facebookProvider.getUserProfile(access_token);

    const user = {
      access_token,
      isAdmin: user_profile.isAdmin,
      name: user_profile.name,
      oauth_id: user_profile.id,
      picture: user_profile.picture,
    };
    await this.userRepository.upsert(user);

    return access_token;
  }
}

module.exports = FacebookSigninUsecase;
