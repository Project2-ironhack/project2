const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

/* GET home page. */
router.get('/', (req, res, next) => {
  Ticket.find({}).populate('creatorId').exec()
    .then((tickets) => {
      let user;
      if (req.user) user = req.user;
      res.render('index', {
        title: 'Easy Answer',
        tickets: tickets,
        user: user || 'Easy Answer'
      });
    })
    .catch( err => console.log(err));
});

module.exports = router;
