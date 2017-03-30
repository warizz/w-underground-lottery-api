const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  access_token: String,
  isAdmin: {
    require: true,
    type: Boolean,
    default: false,
  },
  name: {
    require: true,
    type: String,
  },
  oauth_id: {
    require: true,
    type: String,
  },
  picture: String,
}, { timestamps: true });

UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
