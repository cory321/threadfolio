export const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function adjustEndTimeIfNeeded(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end < start) {
    end.setDate(end.getDate() + 1)
  }

  return end
}

export function formatTimeToHHMMSS(date) {
  return date.toTimeString().split(' ')[0]
}

export function formatDateToLocalMidnight(date) {
  const localDate = new Date(date)

  localDate.setHours(0, 0, 0, 0)

  return localDate.toISOString().split('T')[0]
}
