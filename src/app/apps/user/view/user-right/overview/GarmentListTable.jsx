'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Vars
const garmentTable = [
  {
    id: 1,
    progressValue: 78,
    dueDate: 'Nov 15, 2024',
    progressColor: 'success',
    orderNumber: '#1234',
    garmentTitle: 'Classic Sweater',
    serviceTotal: '$120.50'
  },
  {
    id: 2,
    progressValue: 18,
    dueDate: 'Jan 12, 2024',
    progressColor: 'error',
    orderNumber: '#5678',
    garmentTitle: 'Leather Jacket',
    serviceTotal: '$85.00'
  },
  {
    id: 3,
    progressValue: 62,
    dueDate: 'Feb 10, 2024',
    progressColor: 'primary',
    orderNumber: '#9101',
    garmentTitle: 'Denim Jeans',
    serviceTotal: '$45.75'
  },
  {
    id: 4,
    progressValue: 8,
    dueDate: 'Oct 25, 2024',
    progressColor: 'error',
    orderNumber: '#1121',
    garmentTitle: 'Silk Shirt',
    serviceTotal: '$200.00'
  },
  {
    id: 5,
    progressValue: 49,
    dueDate: 'Mar 8, 2024',
    progressColor: 'warning',
    orderNumber: '#3141',
    garmentTitle: 'Running Shorts',
    serviceTotal: '$60.25'
  },
  {
    id: 6,
    progressValue: 92,
    dueDate: 'Jul 8, 2024',
    progressColor: 'success',
    orderNumber: '#5161',
    garmentTitle: 'Board Shorts',
    serviceTotal: '$150.00'
  },
  {
    id: 7,
    progressValue: 88,
    dueDate: 'Dec 20, 2024',
    progressColor: 'success',
    orderNumber: '#7181',
    garmentTitle: 'Baseball Cap',
    serviceTotal: '$30.00'
  }
]

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper()

const GarmentListTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})

  const [data, setData] = useState([...garmentTable])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const columns = useMemo(
    () => [
      columnHelper.accessor('orderNumber', {
        header: 'Order',
        cell: ({ row }) => (
          <Typography variant='body2' style={{ fontWeight: 'bold' }}>
            {row.original.orderNumber}
          </Typography>
        )
      }),
      columnHelper.accessor('garmentTitle', {
        header: 'Garment',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.garmentTitle}
          </Typography>
        )
      }),
      columnHelper.display({
        id: 'stage',
        header: 'Stage',
        cell: () => <Chip label='In Progress' color='primary' size='small' />
      }),
      columnHelper.accessor('progressValue', {
        header: 'Progress',
        cell: ({ row }) => (
          <>
            <Typography color='text.primary'>{`${row.original.progressValue}%`}</Typography>
            <LinearProgress
              color={row.original.progressColor}
              value={row.original.progressValue}
              variant='determinate'
              className='is-full'
            />
          </>
        )
      }),
      columnHelper.accessor('dueDate', {
        header: 'Due Date',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.dueDate}</Typography>
      }),
      columnHelper.accessor('serviceTotal', {
        // Updated column name and accessor
        header: 'Service Total',
        cell: ({ row }) => (
          <Typography variant='body2' style={{ fontWeight: 'bold' }}>
            {row.original.serviceTotal}
          </Typography>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 7
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <CardHeader
        title='Order History'
        className='flex flex-wrap gap-4'
        action={
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Garment'
          />
        }
      />

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='ri-arrow-up-s-line text-xl' />,
                            desc: <i className='ri-arrow-down-s-line text-xl' />
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
    </Card>
  )
}

export default GarmentListTable
