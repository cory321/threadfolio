'use client'

import { useMemo, useState, useContext } from 'react'

import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  Button
} from '@mui/material'
import shortUUID from 'short-uuid'

import EnhancedTableHead from './EnhancedTableHead'
import EnhancedTableToolbar from './EnhancedTableToolbar'
import { getComparator, stableSort } from './utils/sorting'
import ServicesSearch from '@components/services/ServicesSearch'
import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import EditDescriptionDialog from './EditDescriptionDialog'
import serviceUnitTypes from '@/utils/serviceUnitTypes'
import { formatAsCurrency, parseFloatFromCurrency, formatCurrency } from '@/utils/currencyUtils'

export default function ServiceLookup({ userId, isGarmentSaving }) {
  const { services, setServices } = useContext(GarmentServiceOrderContext)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('serviceName')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editingRowId, setEditingRowId] = useState(null)
  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false)
  const [currentDescription, setCurrentDescription] = useState('')
  const [currentEditingRowId, setCurrentEditingRowId] = useState(null)
  const [isUnitPriceFocused, setIsUnitPriceFocused] = useState(false)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = services.map(n => n.uniqueId)

      setSelected(newSelected)

      return
    }

    setSelected([])
  }

  const handleCheckboxClick = (event, uniqueId) => {
    event.stopPropagation()

    if (editingRowId) {
      setEditingRowId(null)
      setSelected([])
    } else {
      const selectedIndex = selected.indexOf(uniqueId)
      let newSelected = []

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, uniqueId)
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1))
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1))
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
      }

      setSelected(newSelected)
    }
  }

  const handleRowClick = uniqueId => {
    if (editingRowId && editingRowId !== uniqueId) {
      handleCancelClick()
    } else if (!editingRowId) {
      const isSelected = selected.indexOf(uniqueId) !== -1
      const newSelected = isSelected ? selected.filter(id => id !== uniqueId) : [...selected, uniqueId]

      setSelected(newSelected)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDelete = () => {
    setServices(prevServices => prevServices.filter(service => !selected.includes(service.uniqueId)))
    setSelected([])
  }

  const handleInputChange = (uniqueId, field, value) => {
    setServices(prevServices =>
      prevServices.map(service => {
        if (service.uniqueId === uniqueId) {
          if (field === 'unit_price') {
            return { ...service, [field]: formatAsCurrency(value) }
          }

          return { ...service, [field]: value }
        }

        return service
      })
    )
  }

  const handleInputBlur = (uniqueId, field, value) => {
    if (field === 'unit_price') {
      const numericValue = parseFloatFromCurrency(value)
      const formattedValue = formatCurrency(numericValue)

      setServices(prevServices =>
        prevServices.map(service => (service.uniqueId === uniqueId ? { ...service, [field]: formattedValue } : service))
      )
    }

    setIsUnitPriceFocused(false)
  }

  const handleServiceSelect = service => {
    const uniqueId = shortUUID.generate() // Generate a unique ID using short-uuid
    const serviceWithUniqueId = { ...service, uniqueId, unit_price: parseFloat(service.unit_price).toFixed(2) } // Add a uniqueId to each service

    setServices(prevServices => [...prevServices, serviceWithUniqueId])
  }

  const formattedSubtotal = useMemo(() => {
    const subtotal = services.reduce((total, service) => {
      const quantity = parseInt(service.qty, 10) || 0
      const unitPrice = parseFloatFromCurrency(service.unit_price)

      return total + quantity * unitPrice
    }, 0)

    return formatCurrency(subtotal)
  }, [services])

  const isSelected = uniqueId => selected.indexOf(uniqueId) !== -1

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - services.length) : 0

  const visibleRows = useMemo(
    () =>
      stableSort(services, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, services]
  )

  const handleOpenDescriptionModal = (description, uniqueId) => {
    if (editingRowId === uniqueId) {
      setCurrentDescription(description)
      setCurrentEditingRowId(uniqueId)
      setDescriptionModalOpen(true)
    }
  }

  const handleSaveDescription = newDescription => {
    const updatedRows = services.map(row => {
      if (row.uniqueId === currentEditingRowId) {
        return { ...row, description: newDescription }
      }

      return row
    })

    setServices(updatedRows)
    setDescriptionModalOpen(false)
  }

  const handleEditClick = uniqueId => {
    setEditingRowId(uniqueId)
    setSelected([])
  }

  const handleCancelClick = () => {
    setEditingRowId(null)
    setSelected([])

    // If you have any temporary state for editing, reset it here
  }

  const handleUnitPriceFocus = uniqueId => {
    setIsUnitPriceFocused(true)
    setServices(prevServices =>
      prevServices.map(service =>
        service.uniqueId === uniqueId
          ? { ...service, unit_price: parseFloatFromCurrency(service.unit_price).toString() }
          : service
      )
    )
  }

  const handleKeyPress = (event, uniqueId) => {
    if (event.key === 'Enter' && editingRowId === uniqueId) {
      handleCancelClick()
    }
  }

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <ServicesSearch
          userId={userId}
          onServiceSelect={handleServiceSelect}
          setServices={setServices}
          isGarmentSaving={isGarmentSaving}
        />
        <EnhancedTableToolbar numSelected={selected.length} onDelete={handleDelete} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={services.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.uniqueId)
                const labelId = `enhanced-table-checkbox-${index}`
                const isEditing = editingRowId === row.uniqueId

                return (
                  <TableRow
                    hover
                    onClick={() => handleRowClick(row.uniqueId)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.uniqueId}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      padding='checkbox'
                      onClick={event => !isEditing && handleCheckboxClick(event, row.uniqueId)}
                    >
                      <Checkbox
                        color='primary'
                        checked={isItemSelected}
                        disabled={isEditing}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component='th' id={labelId} scope='row' padding='none'>
                      {isEditing ? (
                        <TextField
                          value={row.name}
                          onChange={e => handleInputChange(row.uniqueId, 'name', e.target.value)}
                          variant='outlined'
                        />
                      ) : (
                        row.name
                      )}
                    </TableCell>
                    <TableCell
                      component='th'
                      id={labelId}
                      scope='row'
                      padding='none'
                      onClick={() => handleOpenDescriptionModal(row.description, row.uniqueId)}
                    >
                      {row.description}
                    </TableCell>
                    <TableCell align='right'>
                      {isEditing ? (
                        <TextField
                          value={row.qty}
                          onChange={e => handleInputChange(row.uniqueId, 'qty', e.target.value)}
                          variant='outlined'
                          inputProps={{ style: { textAlign: 'right' } }}
                        />
                      ) : (
                        row.qty
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {isEditing ? (
                        <Select
                          value={row.unit}
                          onChange={e => handleInputChange(row.uniqueId, 'unit', e.target.value)}
                          variant='outlined'
                          inputProps={{ style: { textAlign: 'right' } }}
                        >
                          {Object.values(serviceUnitTypes).map(unit => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        row.unit
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {isEditing ? (
                        <TextField
                          value={
                            isUnitPriceFocused ? row.unit_price : formatCurrency(parseFloatFromCurrency(row.unit_price))
                          }
                          onFocus={() => handleUnitPriceFocus(row.uniqueId)}
                          onBlur={e => handleInputBlur(row.uniqueId, 'unit_price', e.target.value)}
                          onChange={e => handleInputChange(row.uniqueId, 'unit_price', e.target.value)}
                          onKeyPress={e => handleKeyPress(e, row.uniqueId)}
                          variant='outlined'
                          inputProps={{ style: { textAlign: 'right' } }}
                        />
                      ) : (
                        formatCurrency(parseFloatFromCurrency(row.unit_price))
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {isEditing ? (
                        <Button onClick={handleCancelClick}>Return</Button>
                      ) : (
                        isItemSelected && <Button onClick={() => handleEditClick(row.uniqueId)}>Edit</Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={services.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 10 }}>
          <Typography variant='h6'>Subtotal: {formattedSubtotal}</Typography>
        </Box>
      </Paper>
      {editingRowId && (
        <EditDescriptionDialog
          open={isDescriptionModalOpen}
          onClose={() => setDescriptionModalOpen(false)}
          description={currentDescription}
          onSave={handleSaveDescription}
        />
      )}
    </Box>
  )
}
