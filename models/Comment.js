const mongoose     = require('mongoose');

const CommentSchema = mongoose.Schema({
  content:    {type: String, required: true},
  image: {type:String},
  ticket_rel: [{type:Schema.Types.ObjectId, ref: 'Ticket' }],
  creatorCommentId: [{type: Schema.Types.ObjectId, ref: 'User'}],
  solved: {type: Boolean, default: false},
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Ticket;
