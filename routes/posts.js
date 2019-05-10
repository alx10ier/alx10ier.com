const Router = require('koa-router')
const router = new Router()
const ensure = require('../assists/ensureAuthenticate')
const { create, update, remove } = require('../controllers/post')
const PostCategory = require('../models/postCategory')
const Post = require('../models/post')

router.get('/', async ctx => {
  await ctx.render('posts/all')
})

router.get('/new', ensure,async ctx => {
  let categories = await PostCategory.find({})
  await ctx.render('posts/edit', { user: ctx.state.user, categories: categories })
})

router.get('/:id', async (ctx, next) => {
  try {
    let post = await Post.findById(ctx.params.id)
    if (post) {
      await ctx.render('posts/post', { post: post, user: ctx.state.user })
    } else {
      await next()
    }
  } catch (e) {
    if (e.name === 'CastError') { // id is not valid
      await next() // not found
    } else { // render error
      throw e
    }
  }
})

router.get('/:id/edit', ensure,async (ctx, next) => {
  let categories = await PostCategory.find({})
  try {
    let post = await Post.findById(ctx.params.id)
    if (post) {
      await ctx.render('posts/edit', { post: post, categories: categories })
    } else {
      await next()
    }
  } catch (e) {
    if (e.name === 'CastError') { // id is not valid
      await next() // not found
    } else { // render error
      throw e
    }
  }
})

router.post('/', create)

router.put('/:id', update)

router.delete('/:id', remove)

module.exports = router