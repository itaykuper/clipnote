import type { TimeFormatOptions } from '@/types'
import { TIME_FORMAT } from '@/config/constants'

/**
 * Formats seconds into MM:SS or HH:MM:SS format
 */
export function formatTime(seconds: number, options: TimeFormatOptions = {}): string {
  const { 
    includeMilliseconds = false, 
    format = TIME_FORMAT.MM_SS 
  } = options

  const totalSeconds = Math.floor(seconds)
  const milliseconds = Math.floor((seconds - totalSeconds) * 1000)
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  let result = ''
  
  if (format === TIME_FORMAT.HH_MM_SS || hours > 0) {
    result = `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    result = `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (includeMilliseconds) {
    result += `.${milliseconds.toString().padStart(3, '0')}`
  }

  return result
}

/**
 * Parses MM:SS or HH:MM:SS format into seconds
 */
export function parseTimeString(timeString: string): number {
  const parts = timeString.split(':').map(Number)
  
  if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts
    return minutes * 60 + seconds
  } else if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts
    return hours * 3600 + minutes * 60 + seconds
  }
  
  throw new Error('Invalid time format. Use MM:SS or HH:MM:SS')
}

/**
 * Calculates the percentage position of a timestamp within a duration
 */
export function getTimelinePosition(timestamp: number, duration: number): number {
  if (duration === 0) return 0
  return Math.max(0, Math.min(100, (timestamp / duration) * 100))
}

/**
 * Calculates timestamp from timeline position percentage
 */
export function getTimestampFromPosition(position: number, duration: number): number {
  return Math.max(0, Math.min(duration, (position / 100) * duration))
}

/**
 * Rounds timestamp to nearest second for better UX
 */
export function roundTimestamp(timestamp: number, precision: number = 1): number {
  return Math.round(timestamp * precision) / precision
}

/**
 * Checks if two timestamps are close enough to be considered the same
 */
export function areTimestampsEqual(time1: number, time2: number, tolerance: number = 0.5): boolean {
  return Math.abs(time1 - time2) <= tolerance
}

/**
 * Formats duration for display purposes
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.round((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }
} 