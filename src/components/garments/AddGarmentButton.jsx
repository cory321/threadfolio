import { Typography } from '@mui/material'

import { StyledAddGarmentButton } from '@components/media/styles/SingleFileUploadWithGalleryStyles'

const AddGarmentButton = ({ handleClickOpen, btnText, fullWidth }) => (
  <StyledAddGarmentButton variant='outlined' color='primary' onClick={handleClickOpen} fullWidth={fullWidth}>
    <i className='ri-t-shirt-line' style={{ marginRight: fullWidth ? 0 : '8px' }} />
    <Typography variant='body2'>{btnText}</Typography>
  </StyledAddGarmentButton>
)

export default AddGarmentButton
