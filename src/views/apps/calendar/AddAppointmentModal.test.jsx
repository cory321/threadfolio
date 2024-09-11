import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useAuth } from '@clerk/nextjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { addAppointment } from '@/app/actions/appointments'
import AddAppointmentModal from './AddAppointmentModal'

// Mock the dependencies
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn()
}))

jest.mock('@/app/actions/appointments', () => ({
  addAppointment: jest.fn()
}))

const theme = createTheme()

const customRender = (ui, options) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, options)

describe('AddAppointmentModal', () => {
  // Setup default props
  const defaultProps = {
    addEventModalOpen: true,
    handleAddEventModalToggle: jest.fn(),
    selectedDate: new Date(),
    dispatch: jest.fn(),
    onAddAppointment: jest.fn()
  }

  beforeEach(() => {
    useAuth.mockReturnValue({
      userId: 'test-user-id',
      getToken: jest.fn().mockResolvedValue('test-token')
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    customRender(<AddAppointmentModal {...defaultProps} />)
    expect(screen.getByText('Add Appointment')).toBeInTheDocument()
  })

  it('handles form submission correctly', async () => {
    addAppointment.mockResolvedValue({ id: 'test-appointment-id' })

    customRender(<AddAppointmentModal {...defaultProps} />)
    console.log(screen.debug())

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Appointment Date'), { target: { value: '2023-07-01' } })
    fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: '10:00 AM' } })
    fireEvent.change(screen.getByLabelText('End Time'), { target: { value: '11:00 AM' } })
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Test Location' } })

    // Simulate selecting a client
    const clientSearchInput = screen.getByRole('combobox')

    fireEvent.change(clientSearchInput, { target: { value: 'John Doe' } })
    fireEvent.click(screen.getByText('John Doe'))

    // Instead of looking for a label, look for a button or element with 'General' text
    const generalAppointmentButton = screen.getByText('General', { exact: false })

    fireEvent.click(generalAppointmentButton)

    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Test notes' } })

    // Submit the form
    await act(async () => {
      console.log('Clicking Schedule button')
      fireEvent.click(screen.getByText('Schedule'))
      console.log('Schedule button clicked')
    })

    console.log('Form submitted')

    // Check if addAppointment was called with correct arguments
    expect(addAppointment).toHaveBeenCalledWith(
      expect.any(String), // clientId
      'test-user-id',
      expect.any(String), // startTime
      expect.any(String), // endTime
      'Test Location',
      'scheduled',
      'general',
      'Test notes',
      false,
      false,
      'test-token'
    )

    // Check if onAddAppointment was called
    expect(defaultProps.onAddAppointment).toHaveBeenCalled()

    // Check if modal was closed
    expect(defaultProps.handleAddEventModalToggle).toHaveBeenCalled()
  })

  it('displays error when client is not selected', async () => {
    customRender(<AddAppointmentModal {...defaultProps} />)

    // Submit the form without selecting a client
    await act(async () => {
      fireEvent.click(screen.getByText('Schedule'))
    })

    expect(screen.getByText('Please select a client before scheduling the appointment.')).toBeInTheDocument()
  })

  // Add more test cases as needed
})
