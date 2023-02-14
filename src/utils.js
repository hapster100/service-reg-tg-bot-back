const { 
  DAYS
} = require('./config')

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

module.exports = {
  subIntervals,
  getSlots
}
