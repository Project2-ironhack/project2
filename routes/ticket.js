var express = require('express');
var router = express.Router();
const Ticket = require('../models/Ticket');
// READ
router.get('/', (req, res, next) => {
  Post.find({}, (err, tickets) => {
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
router.get('/new', (req, res, next) => {
  res.render('ticket/new', {
    title: 'Create New Ticket'
  });
});
//  Adding new Ticket
router.post('/new', (req, res, next) => {
  console.log('USER',req.user);
  console.log('BODY',req.body);
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




module.exports = router;
