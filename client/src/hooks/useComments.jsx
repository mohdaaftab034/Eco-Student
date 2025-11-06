import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { commentsData } from '../assets/assets'

export function useComments(postId) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchComments = async (targetPostId) => {
        try {
            setLoading(true)
            await new Promise(res => setTimeout(res, 300)) // simulate delay
            const filteredComments = commentsData.filter(c => c.post_id === targetPostId)
            setComments(filteredComments)
        } catch (error) {
            console.error('Failed to fetch comments:', error)
            toast.error('Failed to load comments')
        } finally {
            setLoading(false)
        }
    }

    const createComment = async (postId, content, userId, creator, parentCommentId) => {
        const newComment = {
            _id: Date.now().toString(),
            post_id: postId,
            user_id: userId,
            parent_comment_id: parentCommentId || '',
            content,
            likes: [],
            likesCount: 0,
            repliesCount: 0,
            creator,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        setComments(prev => [...prev, newComment])
        toast.success('Comment added successfully!')
        return newComment
    }

    const updateComment = async (commentId, content) => {
        setComments(prev => prev.map(c => c._id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c))
        toast.success('Comment updated successfully!')
    }

    const deleteComment = async (commentId) => {
        setComments(prev => prev.filter(c => c._id !== commentId))
        toast.success('Comment deleted successfully!')
    }

    const toggleCommentLike = async (commentId, userId) => {
        setComments(prev =>
            prev.map(c => {
                if (c._id !== commentId) return c
                const isLiked = c.likes.includes(userId)
                const newLikes = isLiked ? c.likes.filter(id => id !== userId) : [...c.likes, userId]
                return { ...c, likes: newLikes, likesCount: newLikes.length }
            })
        )
    }

    useEffect(() => {
        if (postId) fetchComments(postId)
    }, [postId])

    return {
        comments,
        loading,
        fetchComments,
        createComment,
        updateComment,
        deleteComment,
        toggleCommentLike
    }
}
