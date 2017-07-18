const express = require('express');
const router = express.Router();
const passport = require('passport');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

const {
  ensureLoggedIn,
  ensureLoggedOut
} = require('connect-ensure-login');
// READ
router.get('/list', (req, res, next) => {
  Ticket.find({}, (err, tickets) => {
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
  console.log('USER', req.user);
  let ticket = new Ticket({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    creatorId: req.user._id // IMPORTANT USER ID LOGGED IN
  });

  ticket.save((err, ticket) => {
    res.redirect('/');
  });
});



// Detail TICKET VIEW ->  IT IS NOT NECESSARY LOGIN TO VISIT THE VIEW
router.get('/:id', (req, res, next) => {
  Ticket.findById(req.params.id).populate('creatorId').exec()
    .then(ticket => {
      console.log('ticket oooh yeah-> ', ticket);
      let user;
      if (req.user) user = req.user;
      res.render('ticket/detail', {
        user: user,
        ticket: ticket
      });
    })
    .catch(err => console.log(err));
});

// Add new comment in ticket
// router.post('/:id/createComment', ensureLoggedIn('/auth/login'), (req, res, next) => {
//   console.log(req.user);
//
//   let comment = new Comment({
//     name: req.body.content,
//     image: req.body.image,
//     ticket_rel: req.params._id,
//     creatorCommentId: req.user._id,
//     solved: false,
//     votes: []
//   });
//   comment.save((err, obj) => {
//     res.redirect(`/ticket/${ticket._id}`);
//   });
// });

module.exports = router;
