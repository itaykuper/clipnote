'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        router.push('/signup/check-email')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-100 via-blue-50 to-teal-100">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-rose-300 to-pink-400 rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isSignUp ? 'Hello Again!' : 'Welcome Back!'}
              </h1>
              <p className="text-white/90 text-sm">
                {isSignUp ? "Let's get started with your 30 days trial" : 'Sign in to your account'}
              </p>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-0 bg-white/90 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-white/50 focus:outline-none transition-all placeholder-gray-500"
                />
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-0 bg-white/90 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-white/50 focus:outline-none transition-all placeholder-gray-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>

              {!isSignUp && (
                <div className="text-right">
                  <Link href="/forgot-password" className="text-sm text-white/80 hover:text-white">
                    Recovery Password
                  </Link>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white/90 backdrop-blur-sm text-rose-500 py-3 rounded-xl font-semibold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="mt-6">
              <div className="text-center text-white/80 text-sm mb-4">
                {isSignUp ? "Don't have an account?" : "Don't have an account?"}
              </div>
              
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-white/90 hover:text-white font-medium text-sm transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Sign up'}
              </button>

              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handleGoogleAuth}
                  className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.70492L1.27498 6.60992C0.46498 8.22992 0 10.0599 0 11.9999C0 13.9399 0.46498 15.7699 1.27498 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24C15.2354 24 17.9504 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.87537 19.245 6.22034 17.135 5.27037 14.29L1.28037 17.385C3.25537 21.31 7.31034 24 12.0004 24Z"
                      fill="#34A853"
                    />
                  </svg>
                </button>
                
                <button className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </button>
                
                <button className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Artistic Illustration */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-orange-200 to-pink-300 rounded-l-[3rem]">
          {/* Sky gradient with sun */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-100 via-yellow-100 to-blue-200 rounded-l-[3rem]">
            {/* Sun */}
            <div className="absolute top-16 right-24 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-70"></div>
            <div className="absolute top-20 right-28 w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-90"></div>
          </div>

          {/* Mountains layers with softer colors */}
          <div className="absolute bottom-0 left-0 right-0">
            {/* Back mountains */}
            <svg className="absolute bottom-40 w-full h-64" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path d="M0,200 L0,120 Q50,80 100,100 Q150,70 200,90 Q250,60 300,80 Q350,50 400,70 L400,200 Z" 
                    fill="rgba(59, 130, 246, 0.2)" />
            </svg>
            
            {/* Middle mountains */}
            <svg className="absolute bottom-24 w-full h-48" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path d="M0,150 L0,90 Q80,50 160,70 Q240,40 320,60 Q360,35 400,50 L400,150 Z" 
                    fill="rgba(59, 130, 246, 0.4)" />
            </svg>
            
            {/* Front mountains */}
            <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 400 120" preserveAspectRatio="none">
              <path d="M0,120 L0,80 Q100,30 200,50 Q300,20 400,40 L400,120 Z" 
                    fill="rgba(59, 130, 246, 0.6)" />
            </svg>
          </div>

          {/* Trees with softer colors */}
          <div className="absolute bottom-8 left-1/4">
            <div className="relative">
              <div className="w-2 h-16 bg-gray-700 absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
              <div className="w-8 h-20 bg-gray-800 clip-path-tree absolute bottom-12 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2">
            <div className="relative">
              <div className="w-2 h-20 bg-gray-700 absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
              <div className="w-10 h-24 bg-gray-800 clip-path-tree absolute bottom-16 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
          
          <div className="absolute bottom-8 right-1/3">
            <div className="relative">
              <div className="w-2 h-12 bg-gray-700 absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
              <div className="w-6 h-16 bg-gray-800 clip-path-tree absolute bottom-8 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 