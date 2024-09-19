export const formatOrderNumber = orderNumber => {
  if (orderNumber < 10000) {
    // Pad with leading zeros to ensure at least 4 digits
    return orderNumber.toString().padStart(4, '0')
  } else {
    // For order numbers 10000 and above, display without leading zeros
    return orderNumber.toString()
  }
}
