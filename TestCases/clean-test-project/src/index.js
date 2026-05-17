import { calculateTides } from './calculator.js'
import { formatTable } from './formatters.js'

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '')
    args[key] = argv[i + 1]
  }
  return args
}

function main() {
  const args = parseArgs(process.argv)
  const latitude = Number.parseFloat(args.location ?? '0')
  const date = args.date ?? new Date().toISOString().slice(0, 10)

  const predictions = calculateTides(latitude, date)
  console.log(formatTable(predictions))
}

main()
