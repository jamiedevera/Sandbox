import { TIDAL_CONSTITUENTS, HOURS_PER_DAY } from './constants.js'

const MS_PER_HOUR = 3600 * 1000

export function calculateTides(latitude, dateString) {
  const baseTime = new Date(dateString).getTime()
  const predictions = []

  for (let hour = 0; hour < HOURS_PER_DAY; hour++) {
    const time = baseTime + hour * MS_PER_HOUR
    const height = sumConstituents(time, latitude)
    predictions.push({ hour, height })
  }

  return predictions
}

function sumConstituents(time, latitude) {
  const latitudeFactor = Math.cos((latitude * Math.PI) / 180)

  return TIDAL_CONSTITUENTS.reduce((total, constituent) => {
    const periodMs = constituent.periodHours * MS_PER_HOUR
    const phase = (2 * Math.PI * time) / periodMs
    return total + constituent.amplitude * Math.cos(phase) * latitudeFactor
  }, 0)
}
