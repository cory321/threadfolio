export function getFormattedDate() {
  const now = new Date()

  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  return now.toLocaleDateString('en-US', options)
}
