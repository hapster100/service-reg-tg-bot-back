const { 
  DAYS
} = require('./config')
const { getServices } = require('./storage/services')

function subIntervals(free, taken) {
  const eventTypes = {
    TAKEN_START: 0,
    TAKEN_END: 1,
    FREE_START: 2,
    FREE_END: 3,
  }
  const events = [
    ...taken.flatMap(([s, e]) => [[s, eventTypes.TAKEN_START], [e, eventTypes.TAKEN_END]]),
    ...free.flatMap(([s, e]) => [[s, eventTypes.FREE_START], [e, eventTypes.FREE_END]])
  ]
  events.sort(([at, ae], [bt, be]) => at - bt || ae - be)
  
  const isTakenStart = e => e[1] === eventTypes.TAKEN_START
  const isTakenEnd = e => e[1] === eventTypes.TAKEN_END
  const isFreeEnd = e => e[1] === eventTypes.FREE_END
  const isFreeStart = e => e[1] === eventTypes.FREE_START

  const sub = []

  let i = 0
  let inFree = false
  let takeCount = 0
  let last = null

  while (i < events.length) {
    if (isFreeStart(events[i])) {
      inFree = true
      last = events[i][0]
    }
    if (isFreeEnd(events[i])) {
      inFree = false
      if (takeCount === 0) {
        sub.push([last, events[i][0]])
      }
      last = null
    }
    if (isTakenStart(events[i])) {
      if (last && takeCount === 0 && inFree) {
        sub.push([last, events[i][0]])
      }
      last = null
      takeCount++
    }
    if (isTakenEnd(events[i])) { 
      takeCount--
      if (takeCount === 0) {
        last = events[i][0]
      }
    }
    i++
  }

  return sub.filter(([s, e]) => s !== e)
}

function getSlots(free, taken, duration) {
  const intervals = subIntervals(free, taken)
  const slots = []

  for(let [start, end] of intervals) {
    if (start%DAYS.STEP !== 0) {
      start += DAYS.STEP
      start -= start%DAYS.STEP 
    }
    while(start + duration <= end) {
      slots.push(start)
      start += DAYS.STEP
    }
  }

  return slots
}

function shedulleSlots(year, month, services, orders, shedulle, duration) {
  const serviceDuration = services.reduce((acc, s) => (acc[s.id] = s.durationMinutes, acc), {})
  const daysInMonth = new Date(Date.UTC(year, month+1, 0)).getDate()

  const ordersByDay = {}
  for(let i = 0; i < daysInMonth; i++) {
    ordersByDay[i+1] = []
  }

  for(const order of orders) {
    const day = order.date.getDate()
    ordersByDay[day].push(order)
  }

  const slotsByDay = {}
  const currDate = new Date()
  
  const currYear = currDate.getFullYear()
  const currMonth = currDate.getMonth()
  const currDay = currDate.getDate()
  const currHour = currDate.getHours()
  const currMinute = currDate.getMinutes()

  for(let i = 0; i < daysInMonth; i++) {
    const day = i + 1

    slotsByDay[day] = []
    
    if (year < currYear) continue
    if (year === currYear && month < currMonth) continue
    if (year === currYear && month === currMonth && day < currDay) continue
    if (shedulle[day].free) continue
    
    const free = shedulle[day].intervals.map(({from, to}) => [from, to]) 
    const taken = []
    
    for (const order of ordersByDay[day]) {
      const start = order.time.hours * 60 + order.time.minutes
      const duration = order.serviceIds.reduce((acc, id) => acc + (serviceDuration[id] || 0), 0)
      taken.push([start, start + duration])
    }

    if (year === currYear && month === currMonth && day === currDay) {
      taken.push([0, currHour*60 + currMinute])
    }

    slotsByDay[day] = getSlots(free, taken, duration)
  }

  return slotsByDay
}

function getMasterId(req) {
  let res = req.header('X-Master-Id') || ''
  return res.replace(/=$/, '')
}

function getInitData(req) {
  return req.header('X-Validation-Data') || ''
}

function timeStr(h, m) {
  return [h,m].map(x => `${x}`.padStart(2, '0')).join(':')
}

function dateStr(date) {
  return date.toLocaleString('ru', {
    day: '2-digit',
    month: 'short',
  })
}

function phoneStr(phone) {

  const digits = phone.replace(/\D/g, '').padEnd(10, 'X')
  
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8)
  ]

  return `+7 (${parts[0]}) ${parts[1]}-${parts[2]}-${parts[3]}`
}

async function formatServices(masterId, serviceIds) {
  const services = await getServices(masterId)
  const serviceById = services.reduce((acc, n) => (acc[n.id] = n, acc), {}) 
  return serviceIds
    .map(id => serviceById[id])
    .filter(x => x)
    .map(x => x.name)
}

module.exports = {
  subIntervals,
  getSlots,
  shedulleSlots,
  getMasterId,
  getInitData,
  timeStr,
  dateStr,
  phoneStr,
  formatServices,
}
