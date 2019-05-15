const Koa = require('koa')
const Router = require('koa-router')


const views = require('koa-views')  // need to install pug for .pug rendering
const serve = require('koa-static')
const logger = require('koa-logger')
const session = require('koa-session')
const favicon = require('koa-favicon')
const passport = require('koa-passport')
const bodyParser = require('koa-bodyparser')

const error = require('./middlewares/error')
const flash = require('./middlewares/flash')

const mongooseSetup = require('./assists/mongooseSetup')
const passportSetup = require('./assists/passportSetup')

const index = require('./routes/index')
const posts = require('./routes/posts')
const users = require('./routes/users')
const admin = require('./routes/admin')

const app = new Koa()
const router = new Router()

mongooseSetup();
passportSetup();

app.keys = ['nothing is true'] // TODO put into secrets


app.use(error())
app.use(flash())
app.use(logger())
app.use(serve(__dirname + '/public', { hidden: true }))
app.use(views(__dirname + '/views', { extension: 'pug' }))
app.use(favicon(__dirname + '/public/images/favicon.ico'))
app.use(session(app)) // TODO config session
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

router.use('/', index.routes())
router.use('/posts', posts.routes())
router.use('/users', users.routes())
router.use('/admin', admin.routes())

app.listen(3000, () => console.log('Listening on port 3000'))
