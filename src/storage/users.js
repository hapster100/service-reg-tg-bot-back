const { 
  getById, existsInCollection, setToCollection, 
  updateInCollection, getByIds 
} = require("./mongoose");

async function getUser(id) {
  return await getById('users', id)
}

async function getUsers(ids) {
  return await getByIds('users', ids)
}

async function updateUser(user) {
  const { id, ...fields } = user
  const exists = await existsInCollection('users', id)

  if (!exists) {
    await setToCollection('users', id, fields)
  } else {
    await updateInCollection('users', id, fields)
  }
}

module.exports = {
  getUser,
  getUsers,
  updateUser,
}
