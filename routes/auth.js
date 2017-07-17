const express    = require('express');
const passport   = require('passport');
const router     = express.Router();


router.get('/login', (req, res) => {
    res.render('auth/login', {});
});

app.get('/slack', passport.authorize('slack'));

// OAuth callback url
app.get('/slack/callback',
  passport.authorize('slack', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

router.get('/profile', (req, res) => {
    res.render('auth/profile', {});
});


module.exports = router;