import { useState, useEffect } from 'react'

export function useAuth() {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)

    // Simulate auth change listener
    useEffect(() => {
        // Optional: simulate already logged in user
        const dummyUser = null
        setUser(dummyUser)
        setIsAuthenticated(!!dummyUser)
    }, [])

    const signIn = async () => {
        try {
            setLoading(true)
            await new Promise(res => setTimeout(res, 500)) // simulate delay
            const dummyUser = { userId: 'u1', userName: 'Alice' }
            setUser(dummyUser)
            setIsAuthenticated(true)
        } catch (error) {
            console.error('Sign in failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        try {
            setLoading(true)
            await new Promise(res => setTimeout(res, 300)) // simulate delay
            setUser(null)
            setIsAuthenticated(false)
        } catch (error) {
            console.error('Sign out failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        isAuthenticated,
        loading,
        signIn,
        signOut
    }
}
