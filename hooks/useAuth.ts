import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<{
    id: string;
    email?: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email || undefined
        }
        setUser(userData)
        // Persist user data in local storage
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        // Check local storage for persisted user
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } catch {
            setUser(null)
            localStorage.removeItem('user')
          }
        } else {
          setUser(null)
        }
      }
      
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || undefined
          }
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } else {
          setUser(null)
          localStorage.removeItem('user')
        }
      }
    )

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setLoading(false)
      throw error
    }

    if (data.user) {
      const userData = {
        id: data.user.id,
        email: data.user.email || undefined
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    }

    setLoading(false)
    return data
  }

  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      setLoading(false)
      throw error
    }

    setUser(null)
    localStorage.removeItem('user')
    setLoading(false)
  }

  const signup = async (email: string, password: string) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setLoading(false)
      throw error
    }

    if (data.user) {
      const userData = {
        id: data.user.id,
        email: data.user.email || undefined
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    }

    setLoading(false)
    return data
  }

  return { 
    user, 
    login, 
    logout,
    signup,
    loading 
  }
} 