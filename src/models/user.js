const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  oauth_id: {
    require: true,
    type: String,
  },
  name: {
    require: true,
    type: String,
  },
  picture: String,
  access_token: String,
}, { timestamps: true });

UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
