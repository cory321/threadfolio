function createData(id, serviceName, quantity, unit, unitPrice) {
  return { id, serviceName, quantity, unit, unitPrice }
}

const rows = [
  createData(1, 'Hem Pants', 2, 'item', 10.0),
  createData(2, 'Alter Dress', 1, 'hour', 30.0),
  createData(3, 'Sew Buttons', 5, 'item', 1.5),
  createData(4, 'Custom Shirt', 3, 'day', 20.0),
  createData(5, 'Repair Zipper', 1, 'item', 5.0),
  createData(6, 'Adjust Waist', 1, 'hour', 15.0),
  createData(7, 'Curtain Hemming', 2, 'hour', 25.0),
  createData(8, 'Replace Lining', 1, 'day', 50.0),
  createData(9, 'Patch Holes', 4, 'item', 2.0),
  createData(10, 'Resize Jacket', 1, 'day', 40.0)
]

export default rows
