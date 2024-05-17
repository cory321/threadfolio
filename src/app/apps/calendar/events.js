// Vars
const date = new Date()
const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)

const nextMonth =
  date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1)

const prevMonth =
  date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1)

export const events = [
  //   {
  //     id: '5a2fedb5-c8c9-47ee-b4d0-22974039d147',
  //     title: 'Order Pickup',
  //     start: '2024-05-22T23:30:00.000Z',
  //     end: '2024-05-23T03:00:00.000Z',
  //     allDay: false,
  //     extendedProps: {
  //       location: '1234 Seamstress Shop Ave. Paso Robles, CA 93446',
  //       status: 'scheduled',
  //       type: 'order_pickup',
  //       sendEmail: false,
  //       sendSms: false,
  //       notes: ''
  //     }
  //   },
  //   {
  //     id: 'ec02a1a5-baf5-4a08-a140-982a5832ba01',
  //     title: 'General Appointment',
  //     start: '2024-05-18T07:49:30.000Z',
  //     end: '2024-05-18T07:49:30.000Z',
  //     allDay: false,
  //     extendedProps: {
  //       location: '1234 Seamstress Shop Ave. Paso Robles, CA 93446',
  //       status: 'scheduled',
  //       type: 'general',
  //       sendEmail: false,
  //       sendSms: false,
  //       notes: ''
  //     }
  //   }
]
