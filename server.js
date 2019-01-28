const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const fs = require('fs')

const app = new Koa()
const router = new Router()

app.use(cors())
app.use(bodyParser({
  formLimit: '10mb'
}))

app.use(router.routes())
app.use(router.allowedMethods())

router.post('/save', (ctx, next) => {
  const data = ctx.request.body
  
  fs.writeFile('./result.json', JSON.stringify(data), function(err) {
    if(err) {
      throw err
    }
  })

  ctx.body = JSON.stringify(data)
})


app.listen(3000)