import serviceUnitTypes from './serviceUnitTypes'

export function pluralizeUnit(unit, quantity) {
  if (quantity === 1) {
    return unit
  }

  switch (unit) {
    case serviceUnitTypes.ITEM:
      return 'items'
    case serviceUnitTypes.MINUTE:
      return 'minutes'
    case serviceUnitTypes.HOUR:
      return 'hours'
    case serviceUnitTypes.DAY:
      return 'days'
    case serviceUnitTypes.WEEK:
      return 'weeks'
    case serviceUnitTypes.MONTH:
      return 'months'
    default:
      return unit // If the unit is not recognized, return it as-is
  }
}
