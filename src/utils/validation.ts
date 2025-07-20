import type { ValidationResult, CommentFormData, ProjectFormData } from '@/types'
import { SUPPORTED_VIDEO_FORMATS, MAX_FILE_SIZE, ERROR_MESSAGES } from '@/config/constants'

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  
  if (!email.trim()) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []
  
  if (!password) {
    errors.push('Password is required')
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates project form data
 */
export function validateProjectForm(data: ProjectFormData): ValidationResult {
  const errors: string[] = []
  
  if (!data.title?.trim()) {
    errors.push(ERROR_MESSAGES.MISSING_TITLE)
  }
  
  if (!data.videoUrl) {
    errors.push(ERROR_MESSAGES.MISSING_VIDEO)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates comment form data
 */
export function validateCommentForm(data: CommentFormData): ValidationResult {
  const errors: string[] = []
  
  if (!data.content?.trim()) {
    errors.push(ERROR_MESSAGES.MISSING_COMMENT)
  }
  
  if (data.timestamp < 0) {
    errors.push('Invalid timestamp')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates video file format
 */
export function validateVideoFormat(filename: string): ValidationResult {
  const errors: string[] = []
  const extension = filename.split('.').pop()?.toLowerCase()
  
  if (!extension || !SUPPORTED_VIDEO_FORMATS.includes(extension)) {
    errors.push(ERROR_MESSAGES.INVALID_VIDEO_FORMAT)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates file size
 */
export function validateFileSize(size: number): ValidationResult {
  const errors: string[] = []
  
  if (size > MAX_FILE_SIZE) {
    errors.push(ERROR_MESSAGES.FILE_TOO_LARGE)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates video file (combines format and size validation)
 */
export function validateVideoFile(file: File): ValidationResult {
  const formatValidation = validateVideoFormat(file.name)
  const sizeValidation = validateFileSize(file.size)
  
  const errors = [...formatValidation.errors, ...sizeValidation.errors]
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates project title
 */
export function validateProjectTitle(title: string): ValidationResult {
  const errors: string[] = []
  
  if (!title.trim()) {
    errors.push('Project title is required')
  } else if (title.trim().length < 3) {
    errors.push('Project title must be at least 3 characters long')
  } else if (title.trim().length > 100) {
    errors.push('Project title must be less than 100 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): ValidationResult {
  const errors: string[] = []
  
  try {
    new URL(url)
  } catch {
    errors.push('Invalid URL format')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
} 