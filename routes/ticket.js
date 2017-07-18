const express = require('express');
const router = express.Router();
const passport = require('passport')
const Ticket = require('../models/Ticket');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
// READ
router.get('/list', (req, res, next) => {
  Post.find({}, (err, tickets) => {
    console.log(tickets);
    if (err) {
      return next(err);
    } else {
      res.render('index', {
        title: "List of tickets",
        tickets: tickets
      });
    }
  });
});
//  Show template form adding
router.get('/new', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('ticket/new');
});

//  Adding new Ticket
router.post('/new', (req, res, next) => {
  console.log('USER',req.user);
  let ticket = new Ticket({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    creatorId: req.user._id    // IMPORTANT USER ID LOGGED IN
  });

  ticket.save((err, ticket) => {
    res.redirect('/');
  });
});

//detail page route
router.get('/:id', ensureLoggedIn('/auth/login'), (req, res, next) => {
  console.log(res.params.id);
  res.render('ticket/detail');
});




module.exports = router;
