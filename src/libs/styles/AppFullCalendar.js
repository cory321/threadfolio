'use client'

// MUI imports
import { styled } from '@mui/material/styles'

// Styled Components
const AppFullCalendar = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .fc': {
    zIndex: 1,
    '.fc-col-header, .fc-daygrid-body, .fc-scrollgrid-sync-table, .fc-timegrid-body, .fc-timegrid-body table': {
      width: '100% !important'
    },

    // Toolbar
    '& .fc-toolbar': {
      flexWrap: 'wrap',
      flexDirection: 'row !important',
      '&.fc-header-toolbar': {
        gap: theme.spacing(2),
        marginBottom: theme.spacing(5)
      },
      '& .fc-toolbar-chunk': {
        display: 'flex',
        alignItems: 'center'
      },
      '& .fc-toolbar-chunk:first-of-type': {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
      },
      '& .fc-prev-button, & .fc-next-button': {
        display: 'inline-flex',
        backgroundColor: 'transparent',
        padding: theme.spacing(1.5),
        border: '1px solid var(--mui-palette-secondary-main)',
        borderRadius: 'var(--mui-shape-borderRadius) !important',
        '& .fc-icon': {
          color: theme.palette.text.secondary,
          fontSize: '1.25rem'
        },
        '&:hover, &:active, &:focus': {
          boxShadow: 'none !important',
          backgroundColor: 'transparent !important'
        }
      },
      '& .fc-prev-button': {
        marginRight: theme.spacing(1)
      },
      '& .fc-next-button': {
        marginRight: theme.spacing(2)
      },
      '& .fc-toolbar-title': {
        ...theme.typography.h4,
        margin: 0,
        padding: 0,
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1,
        height: '100%',
        position: 'relative',
        top: '4px' // Adjust this value as needed to fine-tune the alignment
      },
      '& .fc-button-group': {
        '& .fc-button': {
          textTransform: 'capitalize',
          '&:focus': {
            boxShadow: 'none'
          }
        },
        '& .fc-button-primary': {
          '&:not(.fc-prev-button):not(.fc-next-button)': {
            ...theme.typography.button,
            textTransform: 'capitalize',
            backgroundColor: 'transparent',
            padding: theme.spacing(1.75, 4.5),
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&.fc-button-active, &:hover': {
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.16)`
            }
          }
        }
      },
      '& .fc-today-button': {
        ...theme.typography.button,
        textTransform: 'capitalize',
        backgroundColor: 'transparent',
        padding: theme.spacing(1.75, 4.5),
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        marginRight: theme.spacing(2),
        '&:hover, &:active, &:focus': {
          boxShadow: 'none !important',
          backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.16) !important`
        }
      },
      '& > * > :not(:first-of-type)': {
        marginLeft: 0
      },
      '.fc-button:empty:not(.fc-sidebarToggle-button), & .fc-toolbar-chunk:empty': {
        display: 'none'
      }
    },

    // Calendar head & body common
    '& tbody td, & thead th': {
      borderColor: theme.palette.divider,
      '&.fc-col-header-cell': {
        borderLeft: 0,
        borderRight: 0
      },
      '&[role="presentation"]': {
        borderRightWidth: 0
      }
    },

    // Event Colors
    '& .fc-event': {
      cursor: 'pointer', // Add this line to change the cursor to a pointer for all events
      '&:hover': {
        color: theme.palette.primary.main
      },
      '& .fc-event-title-container, .fc-event-main-frame': {
        lineHeight: 1
      },
      '&:not(.fc-list-event)': {
        '&.event-bg-primary': {
          border: 0,
          color: theme.palette.primary.main,

          // backgroundColor: bgColors.primaryLight.backgroundColor,
          backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.16)`,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: theme.palette.primary.main,
            padding: 0
          }
        },
        '&.event-bg-success': {
          border: 0,
          color: theme.palette.success.main,

          // backgroundColor: bgColors.successLight.backgroundColor,
          backgroundColor: `rgb(${theme.vars.palette.success.mainChannel} / 0.16)`,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: theme.palette.success.main,
            padding: 0
          }
        },
        '&.event-bg-error': {
          border: 0,
          color: theme.palette.error.main,

          // backgroundColor: bgColors.errorLight.backgroundColor,
          backgroundColor: `rgb(${theme.vars.palette.error.mainChannel} / 0.16)`,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: theme.palette.error.main,
            padding: 0
          }
        },
        '&.event-bg-warning': {
          border: 0,
          color: theme.palette.warning.main,

          // backgroundColor: bgColors.warningLight.backgroundColor,
          backgroundColor: `rgb(${theme.vars.palette.warning.mainChannel} / 0.16)`,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: theme.palette.warning.main,
            padding: 0
          }
        },
        '&.event-bg-info': {
          border: 0,
          color: theme.palette.info.main,

          // backgroundColor: bgColors.infoLight.backgroundColor,
          backgroundColor: `rgb(${theme.vars.palette.info.mainChannel} / 0.16)`,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: theme.palette.info.main,
            padding: 0
          }
        }
      },
      '&.event-bg-primary': {
        '& .fc-list-event-dot': {
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.main
        },
        '&:hover td': {
          backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.16)`
        }
      },
      '&.event-bg-success': {
        '& .fc-list-event-dot': {
          borderColor: theme.palette.success.main,
          backgroundColor: theme.palette.success.main
        },
        '&:hover td': {
          backgroundColor: `rgb(${theme.vars.palette.success.mainChannel} / 0.16)`
        }
      },
      '&.event-bg-error': {
        '& .fc-list-event-dot': {
          borderColor: theme.palette.error.main,
          backgroundColor: theme.palette.error.main
        },
        '&:hover td': {
          backgroundColor: `rgb(${theme.vars.palette.error.mainChannel} / 0.16)`
        }
      },
      '&.event-bg-warning': {
        '& .fc-list-event-dot': {
          borderColor: theme.palette.warning.main,
          backgroundColor: theme.palette.warning.main
        },
        '&:hover td': {
          backgroundColor: `rgb(${theme.vars.palette.warning.mainChannel} / 0.16)`
        }
      },
      '&.event-bg-info': {
        '& .fc-list-event-dot': {
          borderColor: theme.palette.info.main,
          backgroundColor: theme.palette.info.main
        },
        '&:hover td': {
          backgroundColor: `rgb(${theme.vars.palette.info.mainChannel} / 0.16)`
        }
      },
      '&.fc-daygrid-event': {
        backgroundColor: `${theme.palette.primary.main}`,
        color: `${theme.palette.primary.contrastText}`,
        marginLeft: '0',
        marginRight: '0',
        borderRadius: '4px'
      }
    },
    '& .fc-view-harness': {
      minHeight: '650px',
      margin: theme.spacing(0, -5.25),
      width: `calc(100% + ${theme.spacing(5.25 * 2)})`
    },

    // Calendar Head
    '& .fc-col-header': {
      '& .fc-col-header-cell': {
        fontSize: '.875rem',
        color: theme.palette.text.primary,
        '& .fc-col-header-cell-cushion': {
          ...theme.typography.body1,
          fontWeight: 500,
          padding: theme.spacing(2),
          textDecoration: 'none !important'
        }
      }
    },

    // Daygrid
    '& .fc-scrollgrid-section-liquid > td': {
      borderBottom: 0
    },
    '& .fc-daygrid-event-harness': {
      '& .fc-event': {
        padding: theme.spacing(1, 2)
      },
      '&:not(:last-of-type)': {
        marginBottom: theme.spacing(2.5)
      }
    },
    '& .fc-daygrid-day-bottom': {
      marginTop: theme.spacing(1.2)
    },
    '& .fc-daygrid-day': {
      padding: '8px',
      '& .fc-daygrid-day-top': {
        flexDirection: 'row'
      }
    },
    '& .fc-scrollgrid': {
      borderColor: theme.palette.divider
    },
    '& .fc-day-past, & .fc-day-future': {
      '&.fc-daygrid-day-number': {
        color: theme.palette.text.disabled
      }
    },
    '& .fc-daygrid-day-events': {
      marginTop: theme.spacing(2)
    },

    // All Views Event
    '& .fc-daygrid-day-number, & .fc-timegrid-slot-label-cushion, & .fc-list-event-time': {
      textDecoration: 'none !important',
      color: `${theme.palette.text.primary} !important`
    },
    '& .fc-day-today:not(.fc-popover)': {
      backgroundColor: 'var(--mui-palette-action-hover)'
    },

    // Hover effect for dates
    // '& .fc-daygrid-day': {
    //   '&:hover': {
    //     backgroundColor: 'rgba(0, 0, 255, 0.1)', // Change to your desired hover color
    //     cursor: 'pointer'
    //   }
    // },

    // WeekView
    '& .fc-timegrid': {
      '& .fc-scrollgrid-section': {
        '& .fc-col-header-cell, & .fc-timegrid-axis': {
          borderLeft: 0,
          borderRight: 0,
          background: 'transparent',
          borderColor: theme.palette.divider
        },
        '& .fc-timegrid-axis': {
          borderColor: theme.palette.divider
        },
        '& .fc-timegrid-axis-frame': {
          justifyContent: 'center',
          padding: theme.spacing(2),
          alignItems: 'flex-start'
        }
      },
      '& .fc-timegrid-axis': {
        '&.fc-scrollgrid-shrink': {
          '& .fc-timegrid-axis-cushion': {
            ...theme.typography.body2,
            padding: 0,
            textTransform: 'capitalize',
            color: theme.palette.text.disabled
          }
        }
      },
      '& .fc-timegrid-slots': {
        '& .fc-timegrid-slot': {
          height: '3rem',
          borderColor: theme.palette.divider,
          '&.fc-timegrid-slot-label': {
            borderRight: 0,
            padding: theme.spacing(2),
            verticalAlign: 'top'
          },
          '&.fc-timegrid-slot-lane': {
            borderLeft: 0
          },
          '& .fc-timegrid-slot-label-frame': {
            textAlign: 'center',
            '& .fc-timegrid-slot-label-cushion': {
              display: 'block',
              padding: 0,
              ...theme.typography.body2,
              textTransform: 'uppercase'
            }
          }
        }
      },
      '& .fc-timegrid-divider': {
        display: 'none'
      },
      '& .fc-timegrid-event': {
        boxShadow: 'none'
      },
      '.fc-timegrid-col-events': {
        margin: 0,
        '& .fc-event-main-frame': {
          padding: theme.spacing(2)
        }
      }
    },

    // List View
    '& .fc-list': {
      border: 'none',
      '& th[colspan="3"]': {
        position: 'relative'
      },
      '& .fc-list-day-cushion': {
        background: 'transparent',
        padding: theme.spacing(2, 4)
      },
      '.fc-list-event': {
        cursor: 'pointer',
        '&:hover': {
          '& td': {
            // backgroundColor: `rgba(${theme.palette.customColors.main}, 0.04)`
          }
        },
        '& td': {
          borderColor: theme.palette.divider
        }
      },
      '& .fc-list-event-graphic': {
        padding: theme.spacing(2)
      },
      '& .fc-list-day': {
        backgroundColor: theme.vars.palette.action.hover,
        '& .fc-list-day-text, & .fc-list-day-side-text': {
          ...theme.typography.body1,
          fontWeight: 500,
          textDecoration: 'none'
        },
        '&  >  *': {
          background: 'none',
          borderColor: theme.palette.divider
        }
      },
      '& .fc-list-event-title': {
        ...theme.typography.body1,
        color: `${theme.palette.text.secondary} !important`,
        padding: theme.spacing(2, 4, 2, 2)
      },
      '& .fc-list-event-time': {
        ...theme.typography.body1,
        color: `${theme.palette.text.secondary} !important`,
        padding: theme.spacing(2, 4)
      },
      '.fc-list-table tbody > tr:first-child th': {
        borderTop: '1px solid var(--mui-palette-divider)'
      },
      '.fc-list-table': {
        borderBottom: '1px solid var(--mui-palette-divider)'
      }
    },

    // Popover
    '& .fc-popover': {
      zIndex: 20,
      boxShadow: 1,
      borderColor: theme.palette.divider,
      background: theme.palette.background.paper,
      '& .fc-popover-header': {
        padding: theme.spacing(2),
        background: theme.palette.action.hover,
        '& .fc-popover-title, & .fc-popover-close': {
          color: theme.palette.text.primary
        }
      },
      '& .fc-popover-body': {
        '& *:not(.fc-event-main):not(:last-of-type)': {
          marginBottom: theme.spacing(1.2)
        }
      }
    },

    // Media Queries
    [theme.breakpoints.up('md')]: {
      '& .fc-sidebarToggle-button': {
        display: 'none'
      },
      '& .fc-toolbar-title': {
        marginLeft: 0
      }
    },

    // Added left padding to the "today" button
    '& .fc-today-button': {
      marginLeft: theme.spacing(3)
    },

    '& .fc td, & .fc th': {
      border: 'none'
    },

    '& .fc-daygrid-day': {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius
      },
      '& .fc-event': {
        cursor: 'pointer',
        zIndex: 1
      },
      '& .fc-daygrid-more-link': {
        cursor: 'pointer',
        color: theme.palette.primary.main,
        position: 'relative',
        zIndex: 2,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .fc-daygrid-day-top': {
        justifyContent: 'flex-start',
        '& .fc-daygrid-day-number': {
          border: 'none',
          padding: '4px',
          margin: '4px'
        }
      }
    },
    '& .fc-day-other .fc-daygrid-day-top': {
      opacity: 0.5
    },
    '& .fc-day-header': {
      padding: '8px',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    '& .fc-daygrid-day-frame': {
      minHeight: '150px', // Adjust this value as needed
      overflow: 'visible'
    },
    '& .fc-daygrid-day-events': {
      marginTop: '5px',
      overflow: 'visible'
    },
    '& .fc-daygrid-more-link': {
      position: 'absolute',
      bottom: '5px',
      left: '5px',
      right: '5px',
      background: theme.palette.background.paper,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '1em',
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.palette.primary.main,
      boxShadow: theme.shadows[1],
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        textDecoration: 'none'
      }
    }
  },
  '& .fc-h-event': {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    borderRadius: '0',
    '& .fc-event-main': {
      fontWeight: 'bold',
      color: theme.palette.primary.contrastText
    }
  },

  // Apply styles to week view timegrid events
  '& .fc-timegrid-event': {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    borderRadius: '4px',
    minHeight: '30px', // Set a minimum height for short events
    '& .fc-event-main': {
      fontWeight: 'bold',
      color: theme.palette.primary.contrastText
    }
  }
}))

export default AppFullCalendar
