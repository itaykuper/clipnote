import { useState, useRef, useCallback, useEffect } from 'react'
import type { UseTimelineReturn, TimelineState } from '@/types'

interface UseTimelineProps {
  duration: number
  onSeek: (time: number) => void
}

export function useTimeline({ duration, onSeek }: UseTimelineProps): UseTimelineReturn {
  const timelineRef = useRef<HTMLDivElement>(null)
  
  const [state, setState] = useState<TimelineState>({
    isHovering: false,
    hoverTime: 0,
    isDragging: false,
  })

  const calculateTimeFromPosition = useCallback((clientX: number): number => {
    if (!timelineRef.current) return 0
    
    const rect = timelineRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    return percent * duration
  }, [duration])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (duration === 0) return

    const newTime = calculateTimeFromPosition(e.clientX)
    onSeek(newTime)
    
    setState(prev => ({
      ...prev,
      isDragging: true,
      hoverTime: newTime,
    }))
  }, [duration, calculateTimeFromPosition, onSeek])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (duration === 0) return

    const newTime = calculateTimeFromPosition(e.clientX)
    
    setState(prev => ({
      ...prev,
      hoverTime: newTime,
      isHovering: true,
    }))

    // If dragging, seek to the new position
    if (state.isDragging) {
      onSeek(newTime)
    }
  }, [duration, calculateTimeFromPosition, onSeek, state.isDragging])

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({
      ...prev,
      isHovering: false,
      hoverTime: 0,
    }))
  }, [])

  // Global mouse events for dragging
  useEffect(() => {
    if (!state.isDragging) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current || duration === 0) return
      
      const newTime = calculateTimeFromPosition(e.clientX)
      onSeek(newTime)
      
      setState(prev => ({
        ...prev,
        hoverTime: newTime,
      }))
    }

    const handleGlobalMouseUp = () => {
      setState(prev => ({
        ...prev,
        isDragging: false,
      }))
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [state.isDragging, duration, calculateTimeFromPosition, onSeek])

  // Prevent context menu on timeline
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  return {
    timelineRef,
    state,
    actions: {
      handleMouseDown,
      handleMouseMove,
      handleMouseLeave,
      handleContextMenu,
    },
  }
} 