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

//  Show template form adding
router.get('/new', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('ticket/new');
})
;
//  Adding new Ticket
router.post('/new', upload.single('photo'), (req, res, next) => {
let image;
if (req.file) image = req.file.filename;
 else image = "";
  let ticket = new Ticket({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    image: image,
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
      if(ticket) return ticket;
    })
    .catch(err => console.log(err));
});

//EDIT ticket - goes to the EDIT view
router.get('/:id/edit', ensureLoggedIn('auth/login'), (req, res, next) => {
  Ticket.findById(req.params.id, (err, ticket) => {
    if (err)  {
      return next(err); }
    else {
    let user;
    res.render('ticket/edit', {
      user: user,
      ticket: ticket
    });
  }
  });
});

router.post('/:id', upload.single('editPhoto'), ensureLoggedIn('auth/login'),  (req, res, next) => {

  let updates = {
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    image: req.file.filename
  };

  Ticket.findByIdAndUpdate(req.params.id, updates, (err, ticket) => {
    if (err) {
      res.render('/index', {ticket, errors:ticket.errors});
    }
        res.redirect(`/ticket/${ticket._id}`);
  });
});
router.get('/:id/delete', ensureLoggedIn('auth/login'), function(req, res, next) {
  let id = req.params.id;
  Ticket.findByIdAndRemove(id, (err, obj) => {
    if (err){ return next(err); }
    res.redirect("/");
  });
});

// READ comments of the ticket
router.get('/comment/:id', (req, res, next) => {
  var id = req.params.id;
  Comment.find({ticket_rel: id}).populate('creatorCommentId').exec()
  .then( comments => {
        // Return JSON DATA
        res.json(comments);
    })
    .catch( err => console.log(err));
});

// Add new comment in ticket
router.post('/comment/:id', ensureLoggedIn('/auth/login'), (req, res, next) => {
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
