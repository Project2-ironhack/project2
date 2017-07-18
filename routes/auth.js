const express    = require('express');
const passport   = require('passport');
const router     = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

// Passport Routes Configuration
router.get('/login',  ensureLoggedOut(), passport.authenticate('slack'));
// router.get('/login', passport.authorize('slack'));

// OAuth callback url
router.get('/slack/callback', ensureLoggedOut(),
  passport.authenticate('slack', {
    successRedirect : '/auth/profile',
    failureRedirect : '/',
    failureFlash : true
  }));

router.get('/profile', (req, res) => {
    res.render('auth/profile', {title: "Profile:"});
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/#');
});


module.exports = router;
