import React from 'react'
import { clsx } from 'clsx'
import type { StatusBadgeProps } from '@/types'
import { STATUS_BADGE_CLASSES, PROJECT_STATUSES } from '@/config/constants'

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

const statusLabels = {
  [PROJECT_STATUSES.PENDING]: 'Pending',
  [PROJECT_STATUSES.IN_REVIEW]: 'In Review',
  [PROJECT_STATUSES.COMPLETED]: 'Completed',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        // Base styles
        'inline-flex items-center font-medium rounded-full border',
        
        // Size styles
        sizeClasses[size],
        
        // Status-specific styles
        STATUS_BADGE_CLASSES[status]
      )}
    >
      {statusLabels[status]}
    </span>
  )
} 