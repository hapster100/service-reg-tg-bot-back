async function polling(offset = 0) {
  const updates = await api.getUpdates(offset+1)

  console.log('todo polling')

  const newOffset = Math.max(offset, ...updates.map(update => update.id))
  polling(newOffset)
}

async function notify() {

  console.log('todo notify')
  
  setTimeout(notify, 1000 * 60)
}

async function startBot() {
  console.log('starting bot server', new Date().toLocaleTimeString())

  const prevUpdates = await api.getUpdates()
  const offset = Math.max(0, ...prevUpdates.map(update => update.id))
  
  polling(offset)
  notify()
}

module.exports = {
  startBot
}
