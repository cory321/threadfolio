import React from 'react'

import { Avatar } from '@mui/material'

import { getInitials } from '@/utils/getInitials'

const InitialsAvatar = ({ fullName, ...rest }) => {
  return <Avatar {...rest}>{getInitials(fullName)}</Avatar>
}

export default InitialsAvatar
