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
        posts: posts
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

//  Adding new Post
router.post('/new',  upload.single('image') ,(req, res, next) => {
  console.log('FILE',req.file);
  console.log('BODY',req.body);

  let ticket = new Post({
    content: req.body.content,
    creatorId: 'PRUEBA',             // IMPORTANT USER ID LOGGED IN
    pic_path: `/uploads/${req.file.filename}`,
    pic_name: req.file.originalname
  });

  post.save((err, post) => {
    res.redirect('/');
  });
});




module.exports = router;
