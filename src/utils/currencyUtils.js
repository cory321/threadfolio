export const formatAsCurrency = value => {
  const numericValue = value.toString().replace(/[^0-9.]/g, '')
  const parts = numericValue.split('.')

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (parts[1]) {
    parts[1] = parts[1].slice(0, 2) // Limit to 2 decimal places
  }

  return parts.join('.')
}

export const parseFloatFromCurrency = value => {
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0
}

export const formatCurrency = value => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export const formatUnitPrice = (displayUnitPrice, setDisplayUnitPrice, setNewService) => {
  const numericValue = parseFloatFromCurrency(displayUnitPrice)
  const formatted = numericValue.toFixed(2)

  setDisplayUnitPrice(formatAsCurrency(formatted))
  setNewService(prev => ({ ...prev, unit_price: numericValue }))
}
