const express = require('express')
const { getMasterById } = require('../storage/masters')
const { getUser, updateUser, getUsers } = require('../storage/users')
const { getMasterId } = require('../utils')

const usersRouter = express.Router()

usersRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const masterId = getMasterId(req)

    const user = await getUser(id) || null
    const master = await getMasterById(masterId)
    const isAdmin = master?.userId === id

    res.send({ user: { ...user, isAdmin } })
  } catch (e) {
    res.send({ user: null })
  }
})

usersRouter.post('/byIds', async (req, res) => {
  try {
    const { ids } = req.body
    const users = await getUsers(ids)
    res.send({ users })
  } catch (e) {
    res.send({ users: null })
  }
})

usersRouter.post('/', async (req, res) => {
  const { user } = req.body
  try {
    await updateUser(user)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

module.exports = {
  usersRouter,
}
