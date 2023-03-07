const express = require('express')
const crypto = require('crypto')
const config = require('./config')
const { getMasterId, getInitData } = require('./utils')
const https = require('https')
const path = require('path')
const fs = require('fs')

const { servicesRouter } = require('./routes/services')
const { categoriesRouter } = require('./routes/categories')
const { ordersRouter } = require('./routes/orders')
const { shedulleRouter } = require('./routes/shedulle')
const { mastersRouter } = require('./routes/masters')
const { usersRouter } = require('./routes/users')

const { SERVER, DEV_MODE } = require('./config')
const { getMasterById } = require('./storage/masters')
const { notify } = require('./telegram')
const { getService } = require('./storage/services')
const { getImage } = require('./storage/images')

const validate = (initData, token) => {
  const secret = crypto.createHmac('sha256', 'WebAppData').update(token)

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

  return hash === _hash
}

const checkValid = async (req, res, next) => {
  if (DEV_MODE) return next()
  if (req.method === 'OPTIONS') return next()
  
  const initData = getInitData(req)
  const masterId = getMasterId(req)
  const master = await getMasterById(masterId)
  
  if (master) {
    const validateResult = validate(initData, master.telegramToken)
    if (validateResult) return next()
  }

  res.status(403)
  res.end()
}

const addHead = (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next()
}

const logger = (req, _, next) => {
  console.log('\nREQUEST')
  console.log('url', req.url)
  console.log('method', req.method)
  next()
}

let app = express()

const key = fs.readFileSync('.cert/key.pem').toString()
const cert = fs.readFileSync('.cert/cert.pem').toString()
const ca = fs.readFileSync('.cert/ca.pem').toString()

const routers = {
  '/services': servicesRouter,
  '/categories': categoriesRouter,
  '/orders': ordersRouter,
  '/shedulle': shedulleRouter,
  '/users': usersRouter,
  '/masters': mastersRouter,
}

app.use(addHead)
app.use(logger)
app.use(express.json({ limit: '2mb' }))
app.use(express.static(path.join(__dirname, '../bundle')))

for(const path in routers) {
  app.use('/api' + path, checkValid, routers[path])
}

app.get('/img/:id', async (req, res) => {
  const { id } = req.params
  console.log(id)
  try {
    const img = await getImage(id)
    const buff = img.data.buffer
    res.writeHead(200, {
      'Content-Type': img.imgType,
      'Content-Length': buff.length,
    })
    res.end(buff)
  } catch (e) {
    console.log(e)
    res.writeHead(404)
    res.end()
  }
})

app.get('*', (req, res) => {
  const appRoutes = [
    '/neworder',
    '/mylist',
    '/services',
    '/newservice',
    '/newcategory',
    '/shedulle',
    '/profile'
  ]
  if (appRoutes.includes(req.url)) {
    res.redirect('/');
  } else {
    res.send("Удачи")
  }
})

app.post('/validate', (req, res) => {
  const { initData } = req.body
  res.send({ result: validate(initData) })
})

if (SERVER.HTTPS) {
  app = https.createServer({key, cert, ca}, app)
}

app.listen(config.SERVER.PORT, () => {
  console.log('started on', config.SERVER.PORT)
  notify()
})
