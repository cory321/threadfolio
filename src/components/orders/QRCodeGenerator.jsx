// File: src/components/orders/QRCodeGenerator.jsx
'use client'

import { useState } from 'react'

import QRCode from 'react-qr-code'
import { Modal, Box, Button } from '@mui/material'

export default function QRCodeGenerator({ orderId }) {
  const [showQRCode, setShowQRCode] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const isAppLive = true
  const developmentPath = window.location.origin
  const productionPath = 'https://threadfolio.netlify.app'
  const domain = isAppLive ? productionPath : developmentPath

  const orderUrl = `${domain}/orders/${orderId}`

  return (
    <>
      <Button variant='outlined' onClick={() => setShowQRCode(true)}>
        Generate QR Code
      </Button>

      <Modal
        open={showQRCode}
        onClose={() => setShowQRCode(false)}
        aria-labelledby='qr-code-modal-title'
        aria-describedby='qr-code-modal-description'
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: 'background.paper',
            textAlign: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            outline: 'none',
            borderRadius: '8px'
          }}
        >
          <QRCode value={orderUrl} size={256} />
          <Box mt={2}>
            <Button variant='contained' onClick={handlePrint}>
              Print QR Code
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
