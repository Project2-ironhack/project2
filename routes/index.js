const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

/* GET home page. */
router.get('/', (req, res, next) => {
  Ticket.find({}).populate('creatorId').exec().then((tickets) => {
    let user;
    console.log(req.user);
    if (req.user) user = req.user;
    res.render('index', {
      title: 'Express - Generated with IronGenerator',
      tickets: tickets,
      user: user || 'Easy Answer'
    });
  });
});

module.exports = router;
