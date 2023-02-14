const express = require('express')
const crypto = require('crypto')
const config = require('./config')

const addHead = (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', '*');
  next()
}

const logger = (req, _, next) => {
  console.log('url', req.url)
  console.log('method', req.method)
  next()
}


let app = express()
const https = require('https')
const path = require('path')
const fs = require('fs')
const { servicesRouter } = require('./routes/services')
const { categoriesRouter } = require('./routes/categories')
const { ordersRouter } = require('./routes/orders')
const { shedulleRouter } = require('./routes/shedulle')

const key = fs.readFileSync('.cert/key.pem').toString()
const cert = fs.readFileSync('.cert/cert.pem').toString()


const routers = {
  '/services': servicesRouter,
  '/categories': categoriesRouter,
  '/orders': ordersRouter,
  '/shedulle': shedulleRouter,
}

app.use(addHead)
app.use(logger)
app.use(express.json())
app.use(express.static(path.join(__dirname, '../bundle')))

for(const path in routers) {
  app.use('/api' + path, routers[path])
}

app.post('/validate', (req, res) => {
  const { initData } = req.body
  const secret = crypto.createHmac('sha256', 'WebAppData').update(config.API_TOKEN)
  const params = Object.fromEntries(new URLSearchParams(initData))
  const checkString = Object.keys(params)
  .filter((key) => key !== "hash")
  .map((key) => `${key}=${params[key]}`)
  .sort()
  .join("\n");
  
  const { hash } = params
  const _hash = crypto.createHmac('sha256', secret.digest())
    .update(checkString)
    .digest('hex')

  res.send({ result: hash === _hash })
})

if (true) {
  app = https.createServer({key, cert}, app)
}

app.listen(config.SERVER.PORT, () => {
  console.log('started on', config.SERVER.PORT)
})
