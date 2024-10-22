import serviceUnitTypes from './serviceUnitTypes'

export function pluralizeUnit(unit, quantity) {
  if (quantity === 1) {
    return unit
  }

  switch (unit) {
    case serviceUnitTypes.ITEM:
      return 'items'
    case serviceUnitTypes.HOUR:
      return 'hours'
    case serviceUnitTypes.DAY:
      return 'days'
    case serviceUnitTypes.WEEK:
      return 'weeks'
    default:
      return unit
  }
}
