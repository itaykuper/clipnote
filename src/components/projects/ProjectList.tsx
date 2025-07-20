'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { TrashIcon, PencilIcon, PlayIcon, ShareIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import ShareButton from './ShareButton'

interface Project {
  id: string
  title: string
  video_url: string
  thumbnail_url: string | null
  status: string
  created_at: string
  user_id: string
}

interface ProjectListProps {
  initialProjects: Project[]
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    // Load first frame of each video
    projects.forEach(project => {
      if (videoRefs.current[project.id]) {
        const video = videoRefs.current[project.id]
        video?.load()
        // Set currentTime to 0.1 to ensure we get a frame
        video?.addEventListener('loadedmetadata', () => {
          video.currentTime = 0.1
        })
      }
    })
  }, [projects])

  const setVideoRef = (id: string, el: HTMLVideoElement | null) => {
    videoRefs.current[id] = el
  }

  const handleEdit = (project: Project) => {
    setEditing(project.id)
    setEditTitle(project.title)
    setEditStatus(project.status || 'pending')
  }

  const handleSaveEdit = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: editTitle,
          status: editStatus,
        })
        .eq('id', projectId)

      if (error) throw error

      setProjects(projects.map(p => 
        p.id === projectId 
          ? { ...p, title: editTitle, status: editStatus }
          : p
      ))
      setEditing(null)
      router.refresh()
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project')
    }
  }

  const handleCancelEdit = () => {
    setEditing(null)
    setEditTitle('')
    setEditStatus('')
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    setDeleting(projectId)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) {
        throw error
      }

      setProjects(projects.filter(p => p.id !== projectId))
      router.refresh()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    } finally {
      setDeleting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'comment_notification':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'in_review':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'comment_notification':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'in_review':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-500 mb-6">Create your first project to get started with video collaboration</p>
        <Link
          href="/projects/new"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-rose-300 to-pink-400 text-white font-semibold rounded-xl shadow-lg hover:from-rose-400 hover:to-pink-500 transition-all duration-200 transform hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Your First Project
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          {/* Video Thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <video
              ref={(el) => setVideoRef(project.id, el)}
              src={project.video_url}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
              playsInline
            />
            
            {/* Play Button Overlay */}
            <Link href={`/projects/${project.id}`}>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <PlayIcon className="w-6 h-6 text-gray-800 ml-1" />
                </div>
              </div>
            </Link>

            {/* Status Badge */}
            <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(project.status || 'pending')} backdrop-blur-sm flex items-center space-x-1`}>
              {getStatusIcon(project.status || 'pending')}
              <span className="capitalize">
                {project.status === 'comment_notification' ? 'New Comments' : (project.status || 'pending').replace('_', ' ')}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(project)}
                className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-lg transition-all"
                title="Edit project"
              >
                <PencilIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                disabled={deleting === project.id}
                className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-lg transition-all disabled:opacity-50"
                title="Delete project"
              >
                <TrashIcon className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-6">
            {editing === project.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none"
                  placeholder="Project title"
                />
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="comment_notification">Comment Notification</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(project.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white text-sm font-medium rounded-lg hover:from-green-500 hover:to-green-600 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href={`/projects/${project.id}`} className="block group">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-rose-600 transition-colors mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>View</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-rose-300 to-pink-400 text-white text-sm font-medium rounded-lg hover:from-rose-400 hover:to-pink-500 transition-all"
                  >
                    <PlayIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  
                  <ShareButton projectId={project.id} projectTitle={project.title} />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 