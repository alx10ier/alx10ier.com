const Post = require('../models/Post')
const PostCategory = require('../models/PostCategory')
const User = require('../models/User')
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
    let { author, time, category, title, source, content, isPublic } = ctx.request.body
    author = await User.findOne({ username: author })
    if (await PostCategory.findOne({ name: category })) { // check if category already exists
      category = await PostCategory.findOne({ name: category })
    } else {
      category = new PostCategory({
        name: category
      })
    }
    const abs = getAbs(source)
    const timestamp = Date.parse(time)

    const newPost = new Post({
      author,
      time,
      timestamp,
      category,
      title,
      abs,
      source,
      content,
      public: isPublic
    })
    category.posts.push(newPost)
    category.save()
    newPost.save()
    ctx.body = {
      result: 'success',
      id: newPost.id
    }
    await next()
  },

  replace: async (ctx, next) => {
    let { id, author, time, category, title, source, content, isPublic } = ctx.request.body
    author = await User.findOne({ username: author })
    if (await PostCategory.findOne({ name: category })) { // check if category already exists
      category = await PostCategory.findOne({ name: category })
    } else {
      category = new PostCategory({
        name: category
      })
    }
    const abs = getAbs(source)
    const timestamp = Date.parse(time)

    let post = await Post.findById(id).populate('category')
    const oldCategory = post.category
    if (oldCategory !== category) {
      oldCategory.posts = oldCategory.posts.filter(x => x._id.toString() !== id)
    }
    await oldCategory.save()
    if (oldCategory.posts.length === 0) {
      oldCategory.remove()
    }

    post = await Post.findOneAndUpdate({ _id: id }, {
      author,
      time,
      timestamp,
      category,
      title,
      abs,
      source,
      content,
      public: isPublic
    })
    category.posts.push(post)
    category.save()
    ctx.body = {
      result: 'success',
      id
    }
    ctx.status = 201
    await next()
  },

  remove: async (ctx, next) => {
    let id = ctx.params.id
    let post = await Post.findOneAndRemove({ _id: id }).populate('category')
    let category = post.category
    category.posts = category.posts.filter(x => x._id.toString() !== id)
    await category.save()
    if (category.posts.length === 0) {
      category.remove()
    }
    ctx.body = {
      result: 'success',
      id
    }
    await next()
  },

  update: async (ctx, next) => {
    let { id, isPublic } = ctx.request.body
    await Post.updateOne({ _id: id }, {
      public: isPublic
    })
    ctx.body = {
      result: 'success',
      id
    }
    await next()
  }
}