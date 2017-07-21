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
});

//  Adding new Ticket
router.post('/new', upload.single('photo'), (req, res, next) => {

  let image;
  if (req.file) image = req.file.filename;
  else image = 'nofile';

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
      res.render('ticket/detail', {
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

    res.render('ticket/edit', {
      ticket: ticket
    });
  }
  });
});

// UPDATE TICKET
router.post('/:id', upload.single('editPhoto'), ensureLoggedIn('auth/login'),  (req, res, next) => {

  let image;
  if (req.file) image = req.file.filename;
  else image = 'nofile';

  let updates = {
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    image: image
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

var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    console.log(file);
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload2 = multer({ storage : storage}).single('photo-comment');

router.post('/comment/:id', function(req,res){
	upload2(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		// res.end("File is uploaded");
    console.log(req.file);
    let image;
    if (req.file) image = req.file.filename;
    else image = 'nofile';

    console.log(image);

    let comment = new Comment({
      content: req.body.content,
      image: image,
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
});

//Add new comment in ticket
// router.post('/comment/:id', [upload.single('photo-comment'), ensureLoggedIn('/auth/login')], (req, res, next) => {
//
//   console.log(res);
//   console.log("NEW RESSSSSSSS!!!!!!!!!!!!");
// console.log(req.file);
//   let image;
//   if (req.file) image = req.file.filename;
//   else image = 'nofile';
//
//   let comment = new Comment({
//     content: req.body.content,
//     image: image,
//     ticket_rel: req.params.id,
//     creatorCommentId: req.user._id,
//     solved: false,
//     votes: []
//   });
//   console.log('NEW COMMENT', comment);
//   comment.save((err, obj) => {
//     res.redirect(`/ticket/${obj.ticket_rel}`);
//   });
// });

module.exports = router;
