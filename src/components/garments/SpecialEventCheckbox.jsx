import { Grid, Typography, Checkbox, FormControlLabel } from '@mui/material'

import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'

const data = [
  {
    meta: 'Special Event',
    value: 'specialEvent',
    title: 'Special Event',
    content: 'Garment is for a special event'
  }
]

const SpecialEventCheckbox = ({ selected, handleChange }) => (
  <Grid container spacing={4}>
    {data.map((item, index) => (
      <Grid item xs={12} key={index}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item>
            <FormControlLabel
              control={<Checkbox checked={selected.includes(item.value)} onChange={() => handleChange(item.value)} />}
              label={item.title}
            />
          </Grid>
          <Grid item>
            <Typography variant='body2'>{item.content}</Typography>
          </Grid>
        </Grid>
      </Grid>
    ))}
  </Grid>
)

export default SpecialEventCheckbox
