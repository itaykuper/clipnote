import React from 'react'
import { clsx } from 'clsx'
import type { Comment, CommentType } from '@/types'
import { useTimeline } from '@/hooks/useTimeline'
import { formatTime, getTimelinePosition } from '@/utils/time'
import { COMMENT_TYPE_COLORS } from '@/config/constants'

interface TimelineProps {
  currentTime: number
  duration: number
  comments: Comment[]
  onSeek: (time: number) => void
  onCommentClick?: (timestamp: number) => void
  className?: string
}

interface CommentMarkerProps {
  comment: Comment
  duration: number
  onClick?: (timestamp: number) => void
  variant: CommentType
}

function CommentMarker({ comment, duration, onClick, variant }: CommentMarkerProps) {
  const position = getTimelinePosition(comment.timestamp, duration)
  
  return (
    <button
      className={clsx(
        'absolute top-0 bottom-0 w-0.5 transform -translate-x-1/2 z-20',
        'hover:w-1 transition-all duration-150',
        variant === 'editor' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'
      )}
      style={{ left: `${position}%` }}
      onClick={() => onClick?.(comment.timestamp)}
      title={`${comment.content} (${formatTime(comment.timestamp)})`}
    />
  )
}

export function Timeline({
  currentTime,
  duration,
  comments,
  onSeek,
  onCommentClick,
  className
}: TimelineProps) {
  const timeline = useTimeline({ duration, onSeek })
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const hoverProgress = duration > 0 ? (timeline.state.hoverTime / duration) * 100 : 0

  return (
    <div className={clsx('relative', className)}>
      {/* Timeline Container */}
      <div
        ref={timeline.timelineRef}
        className="relative h-2 bg-white/20 rounded-full cursor-pointer group overflow-visible"
        onMouseDown={timeline.actions.handleMouseDown}
        onMouseMove={timeline.actions.handleMouseMove}
        onMouseLeave={timeline.actions.handleMouseLeave}
        onContextMenu={timeline.actions.handleContextMenu}
      >
        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />

        {/* Hover Indicator */}
        {timeline.state.isHovering && (
          <>
            {/* Hover Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/60 z-30 transform -translate-x-1/2"
              style={{ left: `${hoverProgress}%` }}
            />
            
            {/* Hover Time Tooltip */}
            <div
              className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded transform -translate-x-1/2 whitespace-nowrap z-40"
              style={{ left: `${hoverProgress}%` }}
            >
              {formatTime(timeline.state.hoverTime)}
            </div>
          </>
        )}

        {/* Current Time Scrubber */}
        <div
          className={clsx(
            'absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 z-30',
            'transition-transform duration-150',
            timeline.state.isDragging ? 'scale-125' : 'group-hover:scale-110'
          )}
          style={{ left: `${progress}%` }}
        />

        {/* Comment Markers */}
        {comments.map((comment) => (
          <CommentMarker
            key={comment.id}
            comment={comment}
            duration={duration}
            onClick={onCommentClick}
            variant={comment.created_by ? 'editor' : 'client'}
          />
        ))}
      </div>
    </div>
  )
} 