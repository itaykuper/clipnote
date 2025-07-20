import React, { useState } from 'react'
import type { VideoPlayerProps } from '@/types'
import { useVideoControls } from '@/hooks/useVideoControls'
import { useComments } from '@/hooks/useComments'
import { Timeline } from './Timeline'
import { VideoControls } from './VideoControls'
import { CommentList } from './CommentList'
import { Button } from '@/components/ui/Button'

export function RefactoredVideoPlayer({ url, projectId, initialComments }: VideoPlayerProps) {
  // Hooks
  const videoControls = useVideoControls()
  const comments = useComments({ 
    projectId, 
    initialComments, 
    enableRealtime: true 
  })

  // Local state
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [newComment, setNewComment] = useState('')

  // Handlers
  const handleTimelineClick = (timestamp: number) => {
    videoControls.actions.seek(timestamp)
  }

  const handleVideoClick = () => {
    videoControls.actions.togglePlayPause()
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      await comments.actions.addComment({
        content: newComment.trim(),
        timestamp: videoControls.controls.currentTime,
      })
      setNewComment('')
      setIsAddingComment(false)
    } catch (error) {
      console.error('Failed to add comment:', error)
      alert('Failed to add comment. Please try again.')
    }
  }

  const handleCommentClick = (timestamp: number) => {
    videoControls.actions.seek(timestamp)
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative">
        <video
          ref={videoControls.videoRef}
          src={url}
          controls={false}
          className="w-full rounded-lg shadow-lg cursor-pointer"
          onClick={handleVideoClick}
          onDoubleClick={() => {
            if (videoControls.videoRef.current) {
              if (videoControls.videoRef.current.requestFullscreen) {
                videoControls.videoRef.current.requestFullscreen()
              }
            }
          }}
        >
          Your browser does not support the video tag.
        </video>

        {/* Custom Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
          <div className="flex items-center gap-4">
            <VideoControls
              isPlaying={videoControls.controls.isPlaying}
              currentTime={videoControls.controls.currentTime}
              duration={videoControls.controls.duration}
              onTogglePlayPause={videoControls.actions.togglePlayPause}
            />
            
            {/* Timeline */}
            <Timeline
              currentTime={videoControls.controls.currentTime}
              duration={videoControls.controls.duration}
              comments={comments.comments}
              onSeek={videoControls.actions.seek}
              onCommentClick={handleTimelineClick}
              className="flex-1"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingComment(true)}
              className="text-white hover:text-rose-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Add Comment Form */}
      {isAddingComment && (
        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Add Comment at {videoControls.controls.currentTime.toFixed(1)}s
          </h3>
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || comments.loading.saving}
                loading={comments.loading.saving}
              >
                Save Comment
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddingComment(false)
                  setNewComment('')
                }}
                disabled={comments.loading.saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Comments ({comments.comments.length})
        </h2>
        <CommentList
          comments={comments.comments}
          onCommentClick={handleCommentClick}
          onDeleteComment={comments.actions.deleteComment}
          onReplyToComment={comments.actions.replyToComment}
          onToggleCompletion={comments.actions.toggleCompletion}
          showCompletionControls={true}
          deletingCommentId={comments.loading.deleting}
        />
      </div>
    </div>
  )
} 