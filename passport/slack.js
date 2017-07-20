const passport = require('passport');
const SlackStrategy = require('passport-slack').Strategy;
const {CLIENT_ID, CLIENT_SECRET} = process.env;
const User = require('../models/User');

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// setup the strategy using defaults
passport.use(new SlackStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  }, (accessToken, refreshToken, profile, next) => {

    console.log(profile);

    if( profile.team.id === "T02CQ4EN4" || profile.team.name === "Ironhack"){
      let newUser = {
        token: accessToken,
        slackId: profile.user.id || '',
        teamId: profile.team.id || '',
        teamName: profile.team.name || '',
        teamImage: profile.team.image_88 || '',
        username: profile.user.name || '',
        email: profile.user.email || '',
        imgAvatar: profile.user.image_512 || ''
      };
      console.log(newUser);

      User.findOne({slackId:newUser.slackId}).exec()
      .then(user => {
        if(!user) return new User(newUser).save();
        return User.findByIdAndUpdate(user._id, newUser,{new:true}).exec();
      })
      .then( user => next(null, user))  // go to next middleware
      .catch(e => next(e));

    }else{
      console.log('User Team is not IRONHACK');
      let errorMess =  'You cannot access to platform. You need to be a member of the slack ironhack team';
      return next(null, false, { message: errorMess });
    }
}
));
