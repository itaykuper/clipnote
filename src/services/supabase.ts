import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Comment, Project, ProjectStatus, CommentFormData, SupabaseResponse } from '@/types'
import { DB_TABLES } from '@/config/constants'

export class SupabaseService {
  private supabase = createClientComponentClient()

  // Project operations
  async getProjects(userId: string): Promise<SupabaseResponse<Project[]>> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.PROJECTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async getProject(projectId: string): Promise<SupabaseResponse<Project>> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.PROJECTS)
        .select('*')
        .eq('id', projectId)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseResponse<Project>> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.PROJECTS)
        .insert(projectData)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<SupabaseResponse<Project>> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.PROJECTS)
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async deleteProject(projectId: string): Promise<SupabaseResponse<void>> {
    try {
      const { error } = await this.supabase
        .from(DB_TABLES.PROJECTS)
        .delete()
        .eq('id', projectId)

      return { data: null, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async updateProjectStatus(projectId: string, status: ProjectStatus): Promise<SupabaseResponse<Project>> {
    return this.updateProject(projectId, { status })
  }

  // Comment operations
  async getComments(projectId: string): Promise<SupabaseResponse<Comment[]>> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.COMMENTS)
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async createComment(commentData: CommentFormData & { project_id: string }): Promise<SupabaseResponse<Comment>> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.COMMENTS)
        .insert({
          content: commentData.content,
          timestamp: commentData.timestamp,
          project_id: commentData.project_id,
          created_by: commentData.name || null,
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async updateComment(commentId: string, updates: Partial<Comment>): Promise<SupabaseResponse<Comment>> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.COMMENTS)
        .update(updates)
        .eq('id', commentId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async deleteComment(commentId: string): Promise<SupabaseResponse<void>> {
    try {
      const { error } = await this.supabase
        .from(DB_TABLES.COMMENTS)
        .delete()
        .eq('id', commentId)

      return { data: null, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async toggleCommentCompletion(commentId: string): Promise<SupabaseResponse<Comment>> {
    try {
      // First get the current completion status
      const { data: currentComment } = await this.supabase
        .from(DB_TABLES.COMMENTS)
        .select('is_completed')
        .eq('id', commentId)
        .single()

      const newCompletionStatus = !currentComment?.is_completed

      const { data, error } = await this.supabase
        .from(DB_TABLES.COMMENTS)
        .update({ is_completed: newCompletionStatus })
        .eq('id', commentId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async createReply(parentCommentId: string, content: string, createdBy: string): Promise<SupabaseResponse<Comment>> {
    try {
      // First get the parent comment to inherit project_id and timestamp
      const { data: parentComment } = await this.supabase
        .from(DB_TABLES.COMMENTS)
        .select('project_id, timestamp')
        .eq('id', parentCommentId)
        .single()

      if (!parentComment) {
        throw new Error('Parent comment not found')
      }

      const { data, error } = await this.supabase
        .from(DB_TABLES.COMMENTS)
        .insert({
          content,
          timestamp: parentComment.timestamp,
          project_id: parentComment.project_id,
          created_by: createdBy,
          parent_id: parentCommentId,
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  // Authentication helpers
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      return { data: user, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      return { data: null, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  // Real-time subscriptions
  subscribeToComments(projectId: string, callback: (comments: Comment[]) => void) {
    const channel = this.supabase
      .channel(`comments-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: DB_TABLES.COMMENTS,
          filter: `project_id=eq.${projectId}`,
        },
        async () => {
          // Fetch updated comments
          const { data } = await this.getComments(projectId)
          if (data) {
            callback(data)
          }
        }
      )
      .subscribe()

    return () => {
      this.supabase.removeChannel(channel)
    }
  }

  subscribeToProject(projectId: string, callback: (project: Project) => void) {
    const channel = this.supabase
      .channel(`project-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: DB_TABLES.PROJECTS,
          filter: `id=eq.${projectId}`,
        },
        async () => {
          // Fetch updated project
          const { data } = await this.getProject(projectId)
          if (data) {
            callback(data)
          }
        }
      )
      .subscribe()

    return () => {
      this.supabase.removeChannel(channel)
    }
  }
}

// Export a singleton instance
export const supabaseService = new SupabaseService() 