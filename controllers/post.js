const Post = require('../models/post')
const PostCategory = require('../models/postCategory')
const User = require('../models/user')
const marked = require('marked')
const hljs = require('highlight.js')
marked.setOptions({
  headerIds: false,
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
})

function getAbs(source) {
  const LIMIT = 150;
  const blocks = source.split('\n\n')
  let result = ''
  let  i = 0
  while (result.length < LIMIT && i < blocks.length) {
    result += blocks[i] + '\n\n'
    i++
  }
  return marked(result)
}

module.exports = {
  create: async (ctx, next) => {
    let { author, time, category, title, source, content } = ctx.request.body
    author = await User.findOne({ username: author })
    if (await PostCategory.findOne({ name: category })) { // check if category already exists
      category = await PostCategory.findOne({ name: category })
    } else {
      category = new PostCategory({
        name: category
      })
    }
    const abs = getAbs(source)
    const timestamp = Date.parse(time) / 1000

    const newPost = new Post({
      author,
      time,
      timestamp,
      category,
      title,
      abs,
      source,
      content
    })
    category.save()
    newPost.save()
    ctx.body = {
      result: 'success',
      id: newPost.id
    }
    await next()
  },

  update: async (ctx, next) => {
    let { id, author, time, category, title, source, content } = ctx.request.body
    author = await User.findOne({ username: author })
    if (await PostCategory.findOne({ name: category })) { // check if category already exists
      category = await PostCategory.findOne({ name: category })
    } else {
      category = new PostCategory({
        name: category
      })
    }
    const abs = getAbs(source)
    const timestamp = Date.parse(time) / 1000

    await Post.findOneAndUpdate({ _id: id }, {
      author,
      time,
      timestamp,
      category,
      title,
      abs,
      source,
      content
    })
    category.save()
    ctx.body = {
      result: 'success',
      id
    }
    ctx.status = 201
    await next()
  },

  remove: async (ctx, next) => {

  },

  show: async (ctx, next) => {

  }
}