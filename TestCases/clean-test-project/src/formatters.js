export function formatHeight(meters) {
  return `${meters.toFixed(2)} m`
}

export function formatHour(hour) {
  const padded = String(hour).padStart(2, '0')
  return `${padded}:00`
}

export function formatTable(predictions) {
  const header = 'Hour   Height'
  const divider = '------ -------'
  const rows = predictions.map(point =>
    `${formatHour(point.hour)}   ${formatHeight(point.height)}`
  )
  return [header, divider, ...rows].join('\n')
}
