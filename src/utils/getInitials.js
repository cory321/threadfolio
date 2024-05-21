export const getInitials = string =>
  string
    .split(/\s+/)
    .slice(0, 2)
    .reduce((response, word) => response + word[0].toUpperCase(), '')
