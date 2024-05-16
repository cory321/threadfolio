// React Imports
import { ChangeEvent, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Type Import
import { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Components Imports
import CustomInputVertical from '@core/components/custom-inputs/Vertical'

const data: CustomInputVerticalData[] = [
  {
    value: 'initial_consultation',
    title: 'Initial Consultation',
    content: 'For first-time clients to discuss their needs.',
    asset: 'ri-discuss-line'
  },
  {
    value: 'general',
    title: 'General',
    isSelected: true,
    content: 'Regular appointments and follow-ups.',
    asset: 'ri-calendar-check-line'
  },
  {
    value: 'order_pickup',
    title: 'Order Pickup',
    content: 'To pick up completed orders.',
    asset: 'ri-shopping-bag-line'
  }
]

const CustomVerticalRadioIcon = ({ onChange }) => {
  const initialSelected: string = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1]
    .value

  // States
  const [selected, setSelected] = useState<string>(initialSelected)

  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelected(prop)
      onChange(prop) // Call the onChange prop with the new value
    } else {
      const value = (prop.target as HTMLInputElement).value

      setSelected(value)
      onChange(value) // Call the onChange prop with the new value
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => {
        let asset

        if (item.asset && typeof item.asset === 'string') {
          asset = <i className={classnames(item.asset, 'text-[28px]')} />
        }

        return (
          <CustomInputVertical
            type='radio'
            key={index}
            data={{ ...item, asset }}
            selected={selected}
            name='custom-radios-icons'
            handleChange={handleChange}
            gridProps={{ sm: 4, xs: 12 }}
          />
        )
      })}
    </Grid>
  )
}

export default CustomVerticalRadioIcon
