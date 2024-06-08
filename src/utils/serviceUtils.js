export const handleChange = (e, setServiceState) => {
  const { name, value } = e.target
  let formattedValue = value

  if (name === 'qty') {
    const parsedValue = parseInt(value, 10)

    formattedValue = isNaN(parsedValue) ? '' : parsedValue.toString()
  }

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
  const qty = parseInt(serviceState.qty, 10) || 0
  const unitPrice = parseFloat(serviceState.unit_price) || 0

  return (qty * unitPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}
