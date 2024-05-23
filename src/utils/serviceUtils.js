export const handleChange = (e, setServiceState) => {
  const { name, value } = e.target
  const formattedValue = name === 'qty' ? parseFloat(value) : value

  setServiceState(prevService => ({
    ...prevService,
    [name]: formattedValue
  }))
}

export const handleUnitPriceBlur = (serviceState, setServiceState) => {
  const formattedValue = parseFloat(serviceState.unit_price).toFixed(2)

  if (!isNaN(formattedValue)) {
    setServiceState(prevService => ({
      ...prevService,
      unit_price: formattedValue
    }))
  }
}

export const calculateTotalPrice = serviceState => {
  const qty = parseFloat(serviceState.qty) || 0
  const unitPrice = parseFloat(serviceState.unit_price) || 0

  return (qty * unitPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}
