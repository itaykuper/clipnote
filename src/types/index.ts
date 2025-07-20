// Database Types
export interface Project {
  id: string
  title: string
  video_url: string
  thumbnail_url: string | null
  status: ProjectStatus
  user_id: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  content: string
  timestamp: number
  project_id: string
  created_by: string | null
  created_at: string
  is_completed?: boolean
  parent_id?: string | null
}

// Enums and Status Types
export type ProjectStatus = 'pending' | 'in_review' | 'completed'

export type CommentType = 'editor' | 'client'

// Component Props Types
export interface VideoPlayerProps {
  url: string
  projectId: string
  initialComments: Comment[]
}

export interface ClientVideoPlayerProps {
  url: string
  projectId: string
  initialComments: Comment[]
}

export interface ProjectListProps {
  initialProjects: Project[]
}

export interface NewProjectFormProps {
  userId: string
}

export interface CommentFormProps {
  projectId: string
}

export interface ShareButtonProps {
  projectId: string
  projectTitle: string
}

export interface SendFeedbackButtonProps {
  projectId: string
  onFeedbackSent: () => void
}

// UI Component Props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  title?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface StatusBadgeProps {
  status: ProjectStatus
  size?: 'sm' | 'md'
}

// Video Player Types
export interface VideoControlsState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
}

export interface TimelineState {
  isHovering: boolean
  hoverTime: number
  isDragging: boolean
}

export interface CommentMarkerProps {
  comment: Comment
  duration: number
  onClick: (timestamp: number) => void
  variant: CommentType
}

// Form Types
export interface AuthFormData {
  email: string
  password: string
}

export interface ProjectFormData {
  title: string
  videoUrl?: string
  thumbnailUrl?: string
}

export interface CommentFormData {
  content: string
  timestamp: number
  name?: string | null
}

// Hook Return Types
export interface UseVideoControlsReturn {
  videoRef: React.RefObject<HTMLVideoElement>
  controls: VideoControlsState
  actions: {
    play: () => void
    pause: () => void
    seek: (time: number) => void
    setVolume: (volume: number) => void
    toggleMute: () => void
    togglePlayPause: () => void
  }
}

export interface UseTimelineReturn {
  timelineRef: React.RefObject<HTMLDivElement>
  state: TimelineState
  actions: {
    handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
    handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
    handleMouseLeave: () => void
    handleContextMenu: (e: React.MouseEvent) => void
  }
}

export interface UseCommentsReturn {
  comments: Comment[]
  actions: {
    addComment: (commentData: CommentFormData) => Promise<void>
    deleteComment: (commentId: string) => Promise<void>
    updateComment: (commentId: string, updates: Partial<Comment>) => Promise<void>
    replyToComment: (parentId: string, content: string) => Promise<void>
    toggleCompletion: (commentId: string) => Promise<void>
    refreshComments: () => Promise<void>
    getCommentsByTimestamp: () => Map<number, Comment[]>
    getTopLevelComments: () => Comment[]
    getReplies: (parentId: string) => Comment[]
  }
  loading: {
    saving: boolean
    deleting: string | null
  }
}

// Utility Types
export interface TimeFormatOptions {
  includeMilliseconds?: boolean
  format?: 'mm:ss' | 'hh:mm:ss'
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// API Response Types
export interface SupabaseResponse<T> {
  data: T | null
  error: Error | null
}

export interface UploadResponse {
  url: string
  thumbnailUrl?: string
}

// Configuration Types
export interface CloudinaryConfig {
  cloudName: string
  uploadPreset: string
  maxFileSize: number
}

export interface AppConfig {
  maxVideoSize: number
  supportedFormats: string[]
  defaultStatus: ProjectStatus
} 