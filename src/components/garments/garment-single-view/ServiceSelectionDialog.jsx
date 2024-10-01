import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import ServicesSearch from '@/components/services/ServicesSearch'

const ServiceSelectionDialog = ({ isOpen, onClose, handleServiceSelect, isAddingService }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        Select or Create a Service
        <IconButton
          edge='end'
          color='inherit'
          onClick={onClose}
          aria-label='close'
          sx={{
            position: 'absolute',
            right: 16,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ServicesSearch onServiceSelect={handleServiceSelect} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' disabled={isAddingService}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ServiceSelectionDialog
