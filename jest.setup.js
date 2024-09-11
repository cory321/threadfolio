import React from 'react'

import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme()

global.React = React
global.ThemeProvider = ThemeProvider
global.theme = theme
