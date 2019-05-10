const mongoose = require('mongoose')

const postCategorySchema = mongoose.Schema({
  name: String
})

let PostCategory = mongoose.model('PostCategory', postCategorySchema)
module.exports = PostCategory