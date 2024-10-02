import { useState, useEffect, useRef } from 'react'

import { Card, CardHeader, CardContent, Box, Button, CircularProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import EditNoteIcon from '@mui/icons-material/EditNote'
import CloseIcon from '@mui/icons-material/Close'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './quillEditor.css'
import DOMPurify from 'isomorphic-dompurify'

import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'

import { updateGarment } from '@/app/actions/garments'

import styles from './GarmentNotes.module.css'

const GarmentNotes = ({ garment, setGarment, marginTop = 0 }) => {
  const { userId } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState(garment.notes || '')
  const [isSaving, setIsSaving] = useState(false)
  const quillRef = useRef(null)

  useEffect(() => {
    if (!isEditing) {
      setEditedNotes(garment.notes || '')
    }
  }, [garment.notes, isEditing])

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        if (quillRef.current) {
          quillRef.current.getEditor().focus()
        }
      }, 0)
    }
  }, [isEditing])

  const handleQuillChange = (content, delta, source, editor) => {
    const text = editor.getText().trim()

    if (text === '') {
      setEditedNotes('')
    } else {
      setEditedNotes(content)
    }
  }

  // Function to add target="_blank", rel="noopener noreferrer", and ensure href starts with protocol
  const addTargetBlankToLinks = html => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const links = doc.querySelectorAll('a')

    links.forEach(link => {
      let href = link.getAttribute('href') || ''

      // If href doesn't start with a protocol, prepend 'https://'
      if (
        href &&
        !href.startsWith('http://') &&
        !href.startsWith('https://') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('#') // Ignore anchor links
      ) {
        href = `https://${href}`
        link.setAttribute('href', href)
      }

      // Add target and rel attributes
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')
    })

    return doc.body.innerHTML
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    setIsEditing(false)
    setEditedNotes(garment.notes || '')
  }

  const handleSaveClick = async () => {
    setIsSaving(true)

    try {
      // Add target and rel attributes to all <a> tags
      const updatedNotes = addTargetBlankToLinks(editedNotes)

      // Sanitize and allow target and rel attributes
      const sanitizedNotes = DOMPurify.sanitize(updatedNotes, {
        ADD_ATTR: ['target', 'rel']
      })

      // Update the garment notes in the backend
      await updateGarment(userId, garment.id, { notes: sanitizedNotes })

      // Update the garment state locally
      setGarment(prevGarment => ({
        ...prevGarment,
        notes: sanitizedNotes
      }))

      setIsEditing(false)
      toast.success('Notes updated successfully.')
    } catch (error) {
      console.error('Failed to update notes:', error)
      toast.error('Failed to update notes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!garment.notes && !isEditing) {
    return (
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'right' }}>
        <Button
          variant='outlined'
          color='primary'
          startIcon={<EditNoteIcon />}
          onClick={handleEditClick}
          sx={{ textTransform: 'none' }}
        >
          Add notes
        </Button>
      </Box>
    )
  }

  return (
    <Card sx={{ mt: marginTop }}>
      <CardHeader
        title='Garment Notes'
        action={
          isEditing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant='text'
                color='primary'
                onClick={handleSaveClick}
                disabled={isSaving || editedNotes === garment.notes}
                startIcon={isSaving ? <CircularProgress size={20} /> : null}
              >
                Save
              </Button>
              <Button
                variant='text'
                color='secondary'
                onClick={handleCancelClick}
                disabled={isSaving}
                sx={{ minWidth: 'auto' }}
              >
                <CloseIcon />
              </Button>
            </Box>
          ) : (
            <Button variant='text' color='primary' onClick={handleEditClick} startIcon={<EditIcon />}>
              Edit
            </Button>
          )
        }
      />
      <CardContent>
        <Box>
          {isEditing ? (
            <ReactQuill ref={quillRef} value={editedNotes} onChange={handleQuillChange} theme='snow' />
          ) : (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(garment.notes, {
                  ADD_ATTR: ['target', 'rel']
                })
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default GarmentNotes
