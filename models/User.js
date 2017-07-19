const mongoose     = require('mongoose');

const UserSchema = mongoose.Schema({
  token: String,
  slackId: String,
  teamId: String,
  teamName: String,
  teamImage: String,
  username: String,
  email: String,
  imgAvatar: {type: String, default:"https://placeholdit.imgix.net/~text?txtsize=33&txt=250%C3%97250&w=250&h=250" }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
