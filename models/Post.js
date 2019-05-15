const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  time: String,
  timestamp: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'PostCategory' },
  title: String,
  abs: String,
  source: String,
  content: String,
  public: Boolean
})

let Post = mongoose.model('Post', postSchema)
module.exports = Post