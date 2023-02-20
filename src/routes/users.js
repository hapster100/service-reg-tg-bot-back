const express = require('express')
const { getUser, updateUser, getUsers } = require('../storage/users')

const usersRouter = express.Router()

usersRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await getUser(id) || null
    res.send({ user })
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
