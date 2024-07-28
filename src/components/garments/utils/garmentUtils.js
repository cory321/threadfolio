export const getFirstName = fullName => {
  if (!fullName) return ''
  const nameParts = fullName.trim().split(' ')

  return nameParts[0]
}
