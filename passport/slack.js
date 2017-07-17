const passport = require('passport');
const SlackStrategy = require('passport-slack').Strategy;
const {CLIENT_ID, CLIENT_SECRET} = process.env;

// setup the strategy using defaults
console.log(CLIENT_ID, CLIENT_SECRET);
passport.use(new SlackStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    done(null, profile);
  }
));
