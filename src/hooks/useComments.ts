import { useState, useEffect, useCallback } from 'react'
import type { UseCommentsReturn, Comment, CommentFormData } from '@/types'
import { supabaseService } from '@/services/supabase'
import { validateCommentForm } from '@/utils/validation'
import { ERROR_MESSAGES } from '@/config/constants'

interface UseCommentsProps {
  projectId: string
  initialComments?: Comment[]
  enableRealtime?: boolean
}

export function useComments({ 
  projectId, 
  initialComments = [], 
  enableRealtime = false 
}: UseCommentsProps): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Load comments on mount and refresh them
  const refreshComments = useCallback(async () => {
    try {
      const { data, error } = await supabaseService.getComments(projectId)
      if (error) throw error
      if (data) {
        setComments(data)
      }
    } catch (error) {
      console.error('Error refreshing comments:', error)
    }
  }, [projectId])

  // Initial load and realtime subscription
  useEffect(() => {
    refreshComments()

    if (enableRealtime) {
      const unsubscribe = supabaseService.subscribeToComments(
        projectId,
        setComments
      )
      return unsubscribe
    }
  }, [projectId, enableRealtime, refreshComments])

  // Add new comment
  const addComment = useCallback(async (commentData: CommentFormData): Promise<void> => {
    const validation = validateCommentForm(commentData)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }

    setSaving(true)
    try {
      const { data, error } = await supabaseService.createComment({
        ...commentData,
        project_id: projectId,
      })

      if (error) throw error
      if (!data) throw new Error('No comment returned from server')

      // Optimistically update UI
      setComments(prev => [...prev, data])
    } catch (error) {
      console.error('Error adding comment:', error)
      throw new Error(ERROR_MESSAGES.SAVE_COMMENT_FAILED)
    } finally {
      setSaving(false)
    }
  }, [projectId])

  // Delete comment
  const deleteComment = useCallback(async (commentId: string): Promise<void> => {
    setDeleting(commentId)
    try {
      const { error } = await supabaseService.deleteComment(commentId)
      if (error) throw error

      // Optimistically update UI
      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw new Error(ERROR_MESSAGES.DELETE_COMMENT_FAILED)
    } finally {
      setDeleting(null)
    }
  }, [])

  // Update comment
  const updateComment = useCallback(async (
    commentId: string, 
    updates: Partial<Comment>
  ): Promise<void> => {
    try {
      const { data, error } = await supabaseService.updateComment(commentId, updates)
      if (error) throw error
      if (!data) throw new Error('No comment returned from server')

      // Optimistically update UI
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? { ...comment, ...data } : comment
        )
      )
    } catch (error) {
      console.error('Error updating comment:', error)
      throw new Error('Failed to update comment')
    }
  }, [])

  // Reply to comment
  const replyToComment = useCallback(async (
    parentId: string, 
    content: string
  ): Promise<void> => {
    if (!content.trim()) {
      throw new Error(ERROR_MESSAGES.MISSING_COMMENT)
    }

    setSaving(true)
    try {
      const { data, error } = await supabaseService.createReply(
        parentId, 
        content.trim(), 
        'editor' // Assuming only editors can reply for now
      )

      if (error) throw error
      if (!data) throw new Error('No reply returned from server')

      // Optimistically update UI
      setComments(prev => [...prev, data])
    } catch (error) {
      console.error('Error replying to comment:', error)
      throw new Error('Failed to reply to comment')
    } finally {
      setSaving(false)
    }
  }, [])

  // Toggle comment completion
  const toggleCompletion = useCallback(async (commentId: string): Promise<void> => {
    try {
      const { data, error } = await supabaseService.toggleCommentCompletion(commentId)
      if (error) throw error
      if (!data) throw new Error('No comment returned from server')

      // Optimistically update UI
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? { ...comment, is_completed: data.is_completed } : comment
        )
      )
    } catch (error) {
      console.error('Error toggling completion:', error)
      throw new Error('Failed to toggle completion status')
    }
  }, [])

  // Get comments grouped by timestamp (for replies)
  const getCommentsByTimestamp = useCallback(() => {
    const grouped = new Map<number, Comment[]>()
    
    comments.forEach(comment => {
      const timestamp = comment.timestamp
      if (!grouped.has(timestamp)) {
        grouped.set(timestamp, [])
      }
      grouped.get(timestamp)!.push(comment)
    })

    return grouped
  }, [comments])

  // Get top-level comments (no parent)
  const getTopLevelComments = useCallback(() => {
    return comments.filter(comment => !comment.parent_id)
  }, [comments])

  // Get replies for a specific comment
  const getReplies = useCallback((parentId: string) => {
    return comments.filter(comment => comment.parent_id === parentId)
  }, [comments])

  return {
    comments,
    actions: {
      addComment,
      deleteComment,
      updateComment,
      replyToComment,
      toggleCompletion,
      refreshComments,
      getCommentsByTimestamp,
      getTopLevelComments,
      getReplies,
    },
    loading: {
      saving,
      deleting,
    },
  }
} 