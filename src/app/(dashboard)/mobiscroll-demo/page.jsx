'use client'

import { Eventcalendar, setOptions } from '@mobiscroll/react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'

setOptions({
  theme: 'material',
  themeVariant: 'light',
  responsive: {
    xsmall: {
      view: {
        calendar: {
          type: 'month'
        },
        agenda: {
          type: 'day'
        }
      }
    },

    custom: {
      // Custom breakpoint
      breakpoint: 600,
      view: {
        calendar: {
          labels: true
        }
      }
    }
  }
})

export default function Page() {
  return (
    <div>
      <h1>Appointments</h1>
      <Eventcalendar
        data={[
          {
            start: new Date(),
            title: "Today's event"
          },
          {
            start: new Date(2020, 11, 18, 9, 0),
            end: new Date(2020, 11, 20, 13, 0),
            title: 'Multi day event'
          }
        ]}
      />
    </div>
  )
}
