const Router = require('koa-router')
const router = new Router()
const PostCategory = require('../models/PostCategory')
const ensure = require('../assists/ensureAuthenticate')

router.get('/', ensure,async ctx => {
  const categories = await PostCategory
    .find({})
    .populate('posts', 'title timestamp public')
  await ctx.render('admin', { categories: categories })
})

module.exports = router