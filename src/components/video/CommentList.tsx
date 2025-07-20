import React, { useState } from 'react'
import { formatTime } from '@/utils/time'
import { Button } from '@/components/ui/Button'
import type { Comment } from '@/types'
import { COMMENT_TYPE_COLORS } from '@/config/constants'
import { TrashIcon, CheckIcon } from '@heroicons/react/24/outline'

interface CommentListProps {
  comments: Comment[]
  onCommentClick?: (timestamp: number) => void
  onDeleteComment?: (commentId: string) => Promise<void>
  onReplyToComment?: (commentId: string, content: string) => Promise<void>
  onToggleCompletion?: (commentId: string) => Promise<void>
  showCompletionControls?: boolean
  deletingCommentId?: string | null
  className?: string
}

interface CommentItemProps {
  comment: Comment
  onCommentClick?: (timestamp: number) => void
  onDeleteComment?: (commentId: string) => Promise<void>
  onReplyToComment?: (commentId: string, content: string) => Promise<void>
  onToggleCompletion?: (commentId: string) => Promise<void>
  showCompletionControls?: boolean
  isDeleting?: boolean
}

function CommentItem({
  comment,
  onCommentClick,
  onDeleteComment,
  onReplyToComment,
  onToggleCompletion,
  showCompletionControls = false,
  isDeleting = false
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const isEditor = comment.created_by !== null
  const commentType = isEditor ? 'editor' : 'client'

  const handleReply = async () => {
    if (!replyText.trim() || !onReplyToComment) return

    setIsSubmittingReply(true)
    try {
      await onReplyToComment(comment.id, replyText.trim())
      setReplyText('')
      setIsReplying(false)
    } catch (error) {
      console.error('Error replying to comment:', error)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleDelete = async () => {
    if (!onDeleteComment) return
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await onDeleteComment(comment.id)
      } catch (error) {
        console.error('Error deleting comment:', error)
      }
    }
  }

  const handleToggleCompletion = async () => {
    if (!onToggleCompletion) return
    
    try {
      await onToggleCompletion(comment.id)
    } catch (error) {
      console.error('Error toggling completion:', error)
    }
  }

  return (
    <div className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 hover:shadow-md transition-all">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCommentClick?.(comment.timestamp)}
            className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
          >
            {formatTime(comment.timestamp)}
          </button>
          <span className={`text-xs font-medium ${COMMENT_TYPE_COLORS[commentType]}`}>
            {isEditor ? comment.created_by : 'Client'}
          </span>
          {showCompletionControls && comment.is_completed && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckIcon className="w-3 h-3 mr-1" />
              Completed
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {showCompletionControls && onToggleCompletion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleCompletion}
              className={`p-1.5 ${comment.is_completed ? 'text-green-600' : 'text-gray-400'}`}
              title={comment.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <CheckIcon className="w-4 h-4" />
            </Button>
          )}

          {onDeleteComment && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-red-500 hover:text-red-700"
              title="Delete comment"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Comment Content */}
      <p className="text-gray-800 text-sm leading-relaxed mb-3">
        {comment.content}
      </p>

      {/* Reply Section */}
      {onReplyToComment && (
        <div className="border-t border-gray-200 pt-3">
          {!isReplying ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(true)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Reply
            </Button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyText.trim() || isSubmittingReply}
                  loading={isSubmittingReply}
                >
                  Reply
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false)
                    setReplyText('')
                  }}
                  disabled={isSubmittingReply}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function CommentList({
  comments,
  onCommentClick,
  onDeleteComment,
  onReplyToComment,
  onToggleCompletion,
  showCompletionControls = false,
  deletingCommentId = null,
  className
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 text-sm">
          No comments yet. Click anywhere on the timeline to add your first comment!
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onCommentClick={onCommentClick}
          onDeleteComment={onDeleteComment}
          onReplyToComment={onReplyToComment}
          onToggleCompletion={onToggleCompletion}
          showCompletionControls={showCompletionControls}
          isDeleting={deletingCommentId === comment.id}
        />
      ))}
    </div>
  )
} 