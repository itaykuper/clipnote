import type { AppConfig, CloudinaryConfig } from '@/types'

// File Upload Constants
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB in bytes
export const SUPPORTED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'webm', 'mkv']

// Video Player Constants
export const DEFAULT_VOLUME = 1
export const TIMELINE_UPDATE_INTERVAL = 100 // milliseconds
export const DURATION_POLLING_INTERVAL = 100 // milliseconds
export const DURATION_POLLING_TIMEOUT = 10000 // 10 seconds

// Project Status Constants
export const PROJECT_STATUSES = {
  PENDING: 'pending' as const,
  IN_REVIEW: 'in_review' as const,
  COMPLETED: 'completed' as const,
} as const

// UI Constants
export const MODAL_Z_INDEX = 9999
export const TIMELINE_MARKER_SIZE = 12
export const COMMENT_MARKER_HEIGHT = 4

// Time Format Constants
export const TIME_FORMAT = {
  MM_SS: 'mm:ss' as const,
  HH_MM_SS: 'hh:mm:ss' as const,
} as const

// Animation Duration Constants
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  SAVE_COMMENT_FAILED: 'Failed to save comment. Please try again.',
  DELETE_COMMENT_FAILED: 'Failed to delete comment. Please try again.',
  UPDATE_PROJECT_FAILED: 'Failed to update project. Please try again.',
  INVALID_VIDEO_FORMAT: `Unsupported video format. Please use: ${SUPPORTED_VIDEO_FORMATS.join(', ')}`,
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
  MISSING_TITLE: 'Please enter a project title',
  MISSING_VIDEO: 'Please upload a video',
  MISSING_COMMENT: 'Please enter a comment',
  AUTH_ERROR: 'Authentication failed. Please try again.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  PROJECT_CREATED: 'Project created successfully!',
  PROJECT_UPDATED: 'Project updated successfully!',
  COMMENT_SAVED: 'Comment saved successfully!',
  FEEDBACK_SENT: 'Feedback sent successfully!',
  LINK_COPIED: 'Link copied to clipboard!',
  EMAIL_SENT: 'Email sent successfully!',
} as const

// Cloudinary Configuration
export const CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: 'clipnote',
  maxFileSize: MAX_FILE_SIZE,
}

// Application Configuration
export const APP_CONFIG: AppConfig = {
  maxVideoSize: MAX_FILE_SIZE,
  supportedFormats: SUPPORTED_VIDEO_FORMATS,
  defaultStatus: PROJECT_STATUSES.PENDING,
}

// Database Table Names
export const DB_TABLES = {
  PROJECTS: 'projects',
  COMMENTS: 'comments',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  CLIENT_NAME: 'clipnote_client_name',
  THEME_PREFERENCE: 'clipnote_theme',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  CLOUDINARY_SIGN: '/api/cloudinary/sign',
} as const

// CSS Classes for Status Badges
export const STATUS_BADGE_CLASSES = {
  [PROJECT_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [PROJECT_STATUSES.IN_REVIEW]: 'bg-blue-100 text-blue-800 border-blue-200',
  [PROJECT_STATUSES.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
} as const

// Comment Type Colors
export const COMMENT_TYPE_COLORS = {
  editor: 'text-blue-600',
  client: 'text-purple-600',
} as const 