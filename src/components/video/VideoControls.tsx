import React from 'react'
import { formatTime } from '@/utils/time'
import { Button } from '@/components/ui/Button'

interface VideoControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  onTogglePlayPause: () => void
  className?: string
}

export function VideoControls({
  isPlaying,
  currentTime,
  duration,
  onTogglePlayPause,
  className
}: VideoControlsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePlayPause}
        className="text-white hover:text-rose-300 p-2"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          {!isPlaying ? (
            <path d="M8 5v14l11-7z" />
          ) : (
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          )}
        </svg>
      </Button>

      {/* Time Display */}
      <span className="text-white text-sm font-medium whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  )
} 