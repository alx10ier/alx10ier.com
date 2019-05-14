const Router = require('koa-router')
const router = new Router()
const Post = require('../models/post')

router.get('/', async ctx => {
  const limit = 5
  const page = ctx.query.page || 1
  const posts = await Post
    .find({ public: true })
    .populate('category')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ timestamp: -1, title: -1 })
  const count = await Post.countDocuments({})
  const pageTotal = Math.ceil(count / limit )

  await ctx.render('index', { posts: posts, page, pageTotal })
})

module.exports = router