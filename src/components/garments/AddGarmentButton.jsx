import { Typography } from '@mui/material'

import { StyledUploadButton } from '@components/media/styles/SingleFileUploadWithGalleryStyles'

const AddGarmentButton = ({ handleClickOpen, btnText }) => (
  <StyledUploadButton variant='outlined' color='primary' onClick={handleClickOpen}>
    <i className='ri-t-shirt-line' />
    <Typography variant='body2'>{btnText}</Typography>
  </StyledUploadButton>
)

export default AddGarmentButton
