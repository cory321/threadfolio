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

export const combineDateAndTime = (date, time) => {
  const combined = new Date(date)

  combined.setHours(time.getHours())
  combined.setMinutes(time.getMinutes())
  combined.setSeconds(0)
  combined.setMilliseconds(0)

  return combined
}

export const getNextNearestHour = () => {
  const now = new Date()

  now.setMinutes(0, 0, 0)
  now.setHours(now.getHours() + 1)

  return now
}

// Add other utility functions as needed
