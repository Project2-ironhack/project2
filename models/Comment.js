const mongoose     = require('mongoose');
const CommentSchema = mongoose.Schema({
  content:    {type: String, required: true},
  image: {type:String},
  ticket_rel: [{type:mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  creatorCommentId: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  solved: {type: Boolean, default: false},
  votes: []
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});
const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Ticket;
