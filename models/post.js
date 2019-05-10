const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.Mixed, ref: 'User' },
  time: String,
  timestamp: Number,
  category: { type: mongoose.Schema.Types.Mixed, ref: 'PostCategory' },
  title: String,
  abs: String,
  source: String,
  content: String
})

let Post = mongoose.model('Post', postSchema)
module.exports = Post