import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { postsData } from '../assets/assets'

export function usePosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPosts = async () => {
        try {
            setLoading(true)
            // Simulate API delay
            await new Promise(res => setTimeout(res, 500))
            setPosts(postsData)
        } catch (error) {
            console.error('Failed to fetch posts:', error)
            toast.error('Failed to load posts')
        } finally {
            setLoading(false)
        }
    }

    const createPost = async (content, imageUrl, user_id, creator) => {
        const newPost = {
            _id: Date.now().toString(),
            user_id: user_id || 'anonymous',
            content,
            imageUrl: imageUrl || '',
            likes: [],
            likesCount: 0,
            commentsCount: 0,
            creator: creator || 'Anonymous',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        setPosts(prev => [newPost, ...prev])
        toast.success('Post created successfully!')
        return newPost
    }

    const updatePost = async (postId, updates) => {
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
        toast.success('Post updated successfully!')
    }

    const deletePost = async (postId) => {
        setPosts(prev => prev.filter(p => p._id !== postId))
        toast.success('Post deleted successfully!')
    }

    const toggleLike = async (postId, userId) => {
        setPosts(prev =>
            prev.map(p => {
                if (p._id !== postId) return p
                const isLiked = p.likes.includes(userId)
                const newLikes = isLiked ? p.likes.filter(id => id !== userId) : [...p.likes, userId]
                return { ...p, likes: newLikes, likesCount: newLikes.length }
            })
        )
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    return {
        posts,
        loading,
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
        toggleLike
    }
}
