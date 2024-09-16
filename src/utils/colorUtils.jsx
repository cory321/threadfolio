import tinycolor from 'tinycolor2'

/**
 * Determines whether black or white text has better contrast with the background color.
 * @param {string} backgroundColor - The background color in hex format.
 * @returns {string} - The hex code for the text color ('#000000' or '#FFFFFF').
 */
export function getContrastText(backgroundColor) {
  const color = tinycolor(backgroundColor)

  return color.isLight() ? '#000000' : '#FFFFFF'
}
