const mongoose     = require('mongoose');

const TicketSchema = mongoose.Schema({
  title:    {type: String, required: true},
  content: {type: String, required: true},
  tags:    {
    type: String,
    required: true,
    enum: ['html', 'css', 'js', 'node']
  },
  image: {type:String},
  creatorID: [{type: Schema.Types.ObjectId, ref: 'User'}]
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
