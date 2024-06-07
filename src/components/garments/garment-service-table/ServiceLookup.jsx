import React, { useMemo, useState } from 'react'

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
import shortUUID from 'short-uuid' // Import the short-uuid library

import EnhancedTableHead from './EnhancedTableHead'
import EnhancedTableToolbar from './EnhancedTableToolbar'
import { getComparator, stableSort } from './utils/sorting'
import ServicesSearch from '@components/services/ServicesSearch' // Import the ServicesSearch component

export default function ServiceLookup({ userId }) {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('serviceName')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [services, setServices] = useState([]) // Use state to manage services
  const [editingRowId, setEditingRowId] = useState(null) // State to track which row is being edited

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = services.map(n => n.uniqueId) // Use uniqueId for selection

      setSelected(newSelected)

      return
    }

    setSelected([])
  }

  const handleCheckboxClick = (event, uniqueId) => {
    event.stopPropagation() // Prevent triggering the row click
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
    setEditingRowId(uniqueId) // Set the clicked row as editable
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDelete = () => {
    setServices(services.filter(service => !selected.includes(service.uniqueId)))
    setSelected([])
  }

  const handleInputChange = (id, field, value) => {
    const updatedRows = services.map(row => (row.uniqueId === id ? { ...row, [field]: value } : row))

    setServices(updatedRows)
  }

  const handleServiceSelect = service => {
    const uniqueId = shortUUID.generate() // Generate a unique ID using short-uuid
    const serviceWithUniqueId = { ...service, uniqueId } // Add a uniqueId to each service

    setServices(prevServices => [...prevServices, serviceWithUniqueId])
  }

  const subtotal = useMemo(() => {
    return services.reduce((sum, service) => sum + service.unit_price, 0)
  }, [services])

  const isSelected = uniqueId => selected.indexOf(uniqueId) !== -1

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - services.length) : 0

  const visibleRows = useMemo(
    () =>
      stableSort(services, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, services]
  )

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <ServicesSearch userId={userId} onServiceSelect={handleServiceSelect} />
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
                    key={row.uniqueId} // Use uniqueId as the key
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
                    <TableCell align='right'>
                      {isEditing ? (
                        <TextField
                          value={row.qty}
                          onChange={e => handleInputChange(row.uniqueId, 'qty', e.target.value)}
                          variant='standard'
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
                        />
                      ) : (
                        row.unit
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {isEditing ? (
                        <TextField
                          value={row.unit_price}
                          onChange={e => handleInputChange(row.uniqueId, 'unit_price', e.target.value)}
                          variant='standard'
                        />
                      ) : (
                        row.unit_price
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Typography variant='h6'>Subtotal: ${subtotal.toFixed(2)}</Typography>
        </Box>
      </Paper>
    </Box>
  )
}
