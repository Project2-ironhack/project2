const passport = require('passport');
const SlackStrategy = require('passport-slack').Strategy;
const {CLIENT_ID, CLIENT_SECRET} = process.env;

// setup the strategy using defaults
passport.use(new SlackStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  }, (accessToken, refreshToken, profile, done) => {
    // optionally persist profile data
    done(null, profile);
  }
));
