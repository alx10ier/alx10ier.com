const Router = require('koa-router')
const router = new Router()
const Post = require('../models/post')
const PostCategory = require('../models/postCategory')
const ensure = require('../assists/ensureAuthenticate')

router.get('/', ensure,async ctx => {
  const posts = await Post
    .find({})
    .select('title time category')
  const categories = await PostCategory
    .find({})
  await ctx.render('admin', { posts: posts, categories: categories })
})

module.exports = router