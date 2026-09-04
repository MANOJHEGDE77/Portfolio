const intFormatter = new Intl.NumberFormat('en-IN')

export function formatInt(n: number): string {
  return intFormatter.format(Math.round(n))
}

const clockFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kolkata',
})

export function formatIstClock(date: Date): string {
  return clockFormatter.format(date)
}
