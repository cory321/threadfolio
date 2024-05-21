'use client'

function getInitials(fullName) {
  if (!fullName) return ''

  const nameParts = fullName.trim().split(/\s+/)

  if (nameParts.length === 0) return ''

  const firstInitial = nameParts[0][0].toUpperCase()
  const secondInitial = nameParts.length > 1 ? nameParts[1][0].toUpperCase() : ''

  return firstInitial + secondInitial
}

// Example usage:
console.log(getInitials('Bob Ross')) // BR
console.log(getInitials('Bob Ross Johnson-Hendrix Etc')) // BR
console.log(getInitials('Alice')) // A
console.log(getInitials('546 235235')) // (empty string)

export default function Page() {
  return (
    <div>
      <h1>Finance</h1>
      <div></div>
    </div>
  )
}
