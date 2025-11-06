import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

export function useUserProfiles() {
    const [profiles, setProfiles] = useState({})
    const [loading, setLoading] = useState(false)

    const fetchProfile = useCallback(async (userId) => {
        setLoading(true)
        try {
            // Agar profile already hai to return karo
            if (profiles[userId]) return profiles[userId]

            // Simulate fetch delay
            await new Promise(res => setTimeout(res, 300))

            const dummyProfile = {
                _id: `p_${userId}`,
                user_id: userId,
                username: `User${userId}`,
                bio: 'This is a dummy bio',
                avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
                postsCount: 0,
                followersCount: 0,
                followingCount: 0,
                creator: `User${userId}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            setProfiles(prev => ({ ...prev, [userId]: dummyProfile }))
            return dummyProfile
        } catch (error) {
            console.error('Failed to fetch profile:', error)
            return null
        } finally {
            setLoading(false)
        }
    }, [profiles])

    const createProfile = async (profileData) => {
        setLoading(true)
        try {
            await new Promise(res => setTimeout(res, 300))
            const newProfile = {
                ...profileData,
                _id: `p_${profileData.user_id}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            setProfiles(prev => ({ ...prev, [profileData.user_id]: newProfile }))
            toast.success('Profile created successfully!')
            return newProfile
        } catch (error) {
            console.error('Failed to create profile:', error)
            toast.error('Failed to create profile')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (userId, updates) => {
        setLoading(true)
        try {
            const existingProfile = profiles[userId]
            if (!existingProfile) return null

            const updatedProfile = {
                ...existingProfile,
                ...updates,
                updatedAt: new Date().toISOString()
            }

            setProfiles(prev => ({ ...prev, [userId]: updatedProfile }))
            toast.success('Profile updated successfully!')
            return updatedProfile
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error('Failed to update profile')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getProfileByUsername = useCallback(async (username) => {
        setLoading(true)
        try {
            await new Promise(res => setTimeout(res, 300))
            const profile = Object.values(profiles).find(p => p.username === username)
            if (profile) return profile

            // Agar username nahi mila, dummy profile return karo
            const dummyProfile = {
                _id: `p_${username}`,
                user_id: username,
                username,
                bio: 'This is a dummy bio',
                avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
                postsCount: 0,
                followersCount: 0,
                followingCount: 0,
                creator: username,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            setProfiles(prev => ({ ...prev, [username]: dummyProfile }))
            return dummyProfile
        } catch (error) {
            console.error('Failed to fetch profile by username:', error)
            return null
        } finally {
            setLoading(false)
        }
    }, [profiles])

    return {
        profiles,
        loading,
        fetchProfile,
        createProfile,
        updateProfile,
        getProfileByUsername
    }
}
