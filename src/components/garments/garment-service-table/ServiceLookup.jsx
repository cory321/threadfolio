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
  Typography
} from '@mui/material'
import shortUUID from 'short-uuid'

import EnhancedTableHead from './EnhancedTableHead'
import EnhancedTableToolbar from './EnhancedTableToolbar'
import { getComparator, stableSort } from './utils/sorting'
import ServicesSearch from '@components/services/ServicesSearch'
import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import EditDescriptionDialog from './EditDescriptionDialog'

export default function ServiceLookup({ userId }) {
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

  const handleRowClick = uniqueId => {
    setEditingRowId(uniqueId)
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

  const handleInputChange = (id, field, value) => {
    const updatedRows = services.map(row => {
      if (row.uniqueId === id) {
        if (field === 'unit_price' && parseFloat(value) > 1000000000) {
          value = 1000000000 // Limit unit_price to a maximum of one billion. I don't believe any user will ever charge more than a billion for a service on this app
        }

        const formattedValue = field === 'unit_price' ? parseFloat(value).toFixed(2) : value

        return { ...row, [field]: formattedValue }
      }

      return row
    })

    setServices(updatedRows)
  }

  const handleInputBlur = (id, field, value) => {
    const formattedValue = parseFloat(value).toFixed(2)

    handleInputChange(id, field, formattedValue)
  }

  /*
  We want to have a uniqueId for the services because
  they can be altered and customized before adding them to the db
  */
  const handleServiceSelect = service => {
    const uniqueId = shortUUID.generate() // Generate a unique ID using short-uuid
    const serviceWithUniqueId = { ...service, uniqueId, unit_price: parseFloat(service.unit_price).toFixed(2) } // Add a uniqueId to each service

    setServices(prevServices => [...prevServices, serviceWithUniqueId])
  }

  const subtotal = useMemo(() => {
    return services.reduce((sum, service) => {
      const unitPrice = parseFloat(service.unit_price) || 0
      const qty = parseFloat(service.qty) || 0

      return sum + unitPrice * qty
    }, 0)
  }, [services])

  const formattedSubtotal = useMemo(() => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)
  }, [subtotal])

  const isSelected = uniqueId => selected.indexOf(uniqueId) !== -1

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - services.length) : 0

  const visibleRows = useMemo(
    () =>
      stableSort(services, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, services]
  )

  const handleOpenDescriptionModal = (description, uniqueId) => {
    setCurrentDescription(description)
    setCurrentEditingRowId(uniqueId)
    setDescriptionModalOpen(true)
  }

  const handleSaveDescription = newDescription => {
    const updatedRows = services.map(row => {
      if (row.uniqueId === currentEditingRowId) {
        return { ...row, description: newDescription }
      }

      return row
    })

    setServices(updatedRows)
    setEditingRowId(null)
  }

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <ServicesSearch userId={userId} onServiceSelect={handleServiceSelect} setServices={setServices} />
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
                    <TableCell padding='checkbox' onClick={event => handleCheckboxClick(event, row.uniqueId)}>
                      <Checkbox color='primary' checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                    </TableCell>
                    <TableCell component='th' id={labelId} scope='row' padding='none'>
                      {isEditing ? (
                        <TextField
                          value={row.name}
                          onChange={e => handleInputChange(row.uniqueId, 'name', e.target.value)}
                          variant='standard'
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
                          variant='standard'
                          inputProps={{ style: { textAlign: 'right' } }}
                        />
                      ) : (
                        row.qty
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {isEditing ? (
                        <TextField
                          value={row.unit}
                          onChange={e => handleInputChange(row.uniqueId, 'unit', e.target.value)}
                          variant='standard'
                          inputProps={{ style: { textAlign: 'right' } }}
                        />
                      ) : (
                        row.unit
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {isEditing ? (
                        <TextField
                          value={row.unit_price}
                          onBlur={e => handleInputBlur(row.uniqueId, 'unit_price', e.target.value)}
                          onChange={e => handleInputChange(row.uniqueId, 'unit_price', e.target.value)}
                          variant='standard'
                          inputProps={{ style: { textAlign: 'right' } }}
                        />
                      ) : (
                        parseFloat(row.unit_price).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        })
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
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
      <EditDescriptionDialog
        open={isDescriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        description={currentDescription}
        onSave={handleSaveDescription}
      />
    </Box>
  )
}
