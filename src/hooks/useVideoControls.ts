import { useState, useRef, useEffect, useCallback } from 'react'
import type { UseVideoControlsReturn, VideoControlsState } from '@/types'
import { DEFAULT_VOLUME } from '@/config/constants'

export function useVideoControls(): UseVideoControlsReturn {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [controls, setControls] = useState<VideoControlsState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: DEFAULT_VOLUME,
    isMuted: false,
  })

  // Update controls state when video properties change
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setControls(prev => ({
        ...prev,
        currentTime: video.currentTime,
      }))
    }

    const handleLoadedMetadata = () => {
      setControls(prev => ({
        ...prev,
        duration: video.duration,
      }))
    }

    const handlePlay = () => {
      setControls(prev => ({
        ...prev,
        isPlaying: true,
      }))
    }

    const handlePause = () => {
      setControls(prev => ({
        ...prev,
        isPlaying: false,
      }))
    }

    const handleVolumeChange = () => {
      setControls(prev => ({
        ...prev,
        volume: video.volume,
        isMuted: video.muted,
      }))
    }

    const handleDurationChange = () => {
      if (video.duration > 0) {
        setControls(prev => ({
          ...prev,
          duration: video.duration,
        }))
      }
    }

    // Add event listeners
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('volumechange', handleVolumeChange)

    // Check if video is already loaded
    if (video.readyState >= 1) {
      if (video.duration > 0) {
        setControls(prev => ({
          ...prev,
          duration: video.duration,
        }))
      }
    }

    // Cleanup event listeners
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  // Action handlers
  const play = useCallback(() => {
    videoRef.current?.play()
  }, [])

  const pause = useCallback(() => {
    videoRef.current?.pause()
  }, [])

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(time, controls.duration))
    }
  }, [controls.duration])

  const setVolume = useCallback((volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = Math.max(0, Math.min(1, volume))
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
    }
  }, [])

  const togglePlayPause = useCallback(() => {
    if (controls.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [controls.isPlaying, play, pause])

  return {
    videoRef,
    controls,
    actions: {
      play,
      pause,
      seek,
      setVolume,
      toggleMute,
      togglePlayPause,
    },
  }
} 