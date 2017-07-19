const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const upload = multer ({dest: './public/uploads'});
const {
  ensureLoggedIn,
  ensureLoggedOut
} = require('connect-ensure-login');

// READ
router.get('/list', (req, res, next) => {
  Ticket.find({}, (err, tickets) => {
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


// READ comments of the ticket
router.get('/commentList/:id/', (req, res, next) => {
  var id = req.params.id;
  Comment.find({ticket_rel: id}).populate('creatorCommentId').exec( (err, comments) => {
      console.log(comments);
      if (err) {
        return next(err);
      } else {
        let user;
        if (req.user) user = req.user;
        res.render('ticket/comments', {
          user: user || 'user not defined in router.get',
          title: "Comments",
          comments: comments
        });
      }
    });
});

//  Show template form adding
router.get('/new', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('ticket/new');
});

//  Adding new Ticket
router.post('/new', upload.single('photo'), (req, res, next) => {
  console.log(req.file);
  let ticket = new Ticket({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    image: req.file.filename,
    creatorId: req.user._id // IMPORTANT USER ID LOGGED IN
  });
  console.log(ticket);

  ticket.save((err, ticket) => {
    res.redirect('/');
  });
});

// Detail TICKET VIEW ->  IT IS NOT NECESSARY LOGIN TO VISIT THE VIEW
router.get('/:id', (req, res, next) => {
  Ticket.findById(req.params.id).populate('creatorId').exec()
    .then(ticket => {
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
router.post('/comment/:id', (req, res, next) => {
  let comment = new Comment({
    content: req.body.content,
    image: req.body.image,
    ticket_rel: req.params.id,
    creatorCommentId: req.user._id,
    solved: false,
    votes: []
  });
  console.log('NEW COMMENT', comment);
  comment.save((err, obj) => {
    res.redirect(`/ticket/${obj.ticket_rel}`);
  });
});

module.exports = router;
