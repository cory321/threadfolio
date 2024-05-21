import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js'

export const formatPhoneNumber = (phoneNumberString, defaultCountryCode = 'US') => {
  // Clean the input by removing unnecessary characters
  const cleanedInput = phoneNumberString.replace(/[^\d+]/g, '')

  // Parse the phone number
  let phoneNumber = parsePhoneNumberFromString(cleanedInput, defaultCountryCode)

  // If parsing failed, try as-you-type formatting
  if (!phoneNumber) {
    const asYouType = new AsYouType(defaultCountryCode)

    cleanedInput.split('').forEach(char => asYouType.input(char))
    phoneNumber = asYouType.getNumber()
  }

  // Format the phone number if parsed successfully
  if (phoneNumber) {
    return phoneNumber.formatNational() // Change to formatInternational() if you prefer international format
  } else {
    return phoneNumberString // Return the original if parsing fails
  }
}
