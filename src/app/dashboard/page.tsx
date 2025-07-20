import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProjectList from '@/components/projects/ProjectList'
import Link from 'next/link'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch projects with error logging
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = createServerComponentClient({ cookies })
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-teal-100">
      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/70 border-b border-white/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {/* Go Back Button */}
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all"
                title="Go back to homepage"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Welcome back!
                </h1>
                <p className="text-gray-600 text-sm">
                  {session.user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/projects/new"
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-br from-rose-300 to-pink-400 text-white font-semibold rounded-xl shadow-lg hover:from-rose-400 hover:to-pink-500 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </Link>
              
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{projects?.length || 0}</p>
                <p className="text-gray-600 text-sm">Total Projects</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {projects?.filter(p => p.status === 'completed').length || 0}
                </p>
                <p className="text-gray-600 text-sm">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {projects?.filter(p => p.status === 'pending' || p.status === 'in_review').length || 0}
                </p>
                <p className="text-gray-600 text-sm">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
              <p className="text-gray-600 mt-1">Manage and collaborate on your video projects</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/80 rounded-xl px-4 py-2 border border-gray-200">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 text-sm"
                />
              </div>
              
              <select className="bg-white/80 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none">
                <option>All Status</option>
                <option>Pending</option>
                <option>In Review</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          
          <ProjectList initialProjects={projects || []} />
        </div>
      </main>
    </div>
  )
} 