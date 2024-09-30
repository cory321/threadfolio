'use client'

import Link from 'next/link'

import { Typography, Breadcrumbs } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const Breadcrumb = ({ items }) => {
  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} aria-label='breadcrumb'>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return isLast ? (
          <Typography color='text.primary' key={item.href}>
            {item.label}
          </Typography>
        ) : (
          <Link href={item.href} key={item.href} passHref>
            <Typography color='inherit'>{item.label}</Typography>
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

export default Breadcrumb
