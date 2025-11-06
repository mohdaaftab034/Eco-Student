import React, { useState, useEffect } from 'react'
import { Heart, Reply, Edit2, Trash2, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useUserProfiles } from '../../hooks/useUserProfile'
import { useComments } from '../../hooks/useComments'
import { useAuth } from '../../hooks/useAuth'


const CommentsSection = ({ postId }) => {
    const { user } = useAuth()
    const [isAuthenticated, setIsAuthenticated] = useState(true)
    const { comments, createComment, updateComment, deleteComment, toggleCommentLike } = useComments(postId)
    const { profiles, fetchProfile } = useUserProfiles()
    const [newComment, setNewComment] = useState('')
    const [replyTo, setReplyTo] = useState(null)
    const [replyContent, setReplyContent] = useState('')
    const [editingComment, setEditingComment] = useState(null)
    const [editContent, setEditContent] = useState('')

    // Organize comments into threads
    const topLevelComments = comments.filter(comment => !comment.parent_comment_id)
    const getReplies = (commentId) =>
        comments.filter(comment => comment.parent_comment_id === commentId)

    const handleSubmitComment = async (e) => {
        e.preventDefault()
        if (!isAuthenticated || !user || !newComment.trim()) return

        try {
            await createComment(
                postId,
                newComment.trim(),
                user.userId,
                user.userName || 'Anonymous'
            )
            setNewComment('')
        } catch (error) {
            console.error('Failed to create comment:', error)
        }
    }

    const handleSubmitReply = async (e, parentCommentId) => {
        e.preventDefault()
        if (!isAuthenticated || !user || !replyContent.trim()) return

        try {
            await createComment(
                postId,
                replyContent.trim(),
                user.userId,
                user.userName || 'Anonymous',
                parentCommentId
            )
            setReplyContent('')
            setReplyTo(null)
        } catch (error) {
            console.error('Failed to create reply:', error)
        }
    }

    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) return

        try {
            await updateComment(commentId, editContent.trim())
            setEditingComment(null)
            setEditContent('')
        } catch (error) {
            console.error('Failed to edit comment:', error)
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteComment(commentId)
            } catch (error) {
                console.error('Failed to delete comment:', error)
            }
        }
    }

    const CommentItem = ({ comment, isReply = false }) => {
        const profile = profiles[comment.user_id]
        const isLiked = user ? comment.likes.includes(user.userId) : false
        const isOwner = user?.userId === comment.user_id

        useEffect(() => {
            fetchProfile(comment.user_id)
        }, [comment.user_id])

        return (
            <div className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
                <div className="flex gap-3">
                    <img
                        src={profile?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'}
                        alt={profile?.username || comment.creator}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                        <div className="bg-[#fafaff] rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    {profile?.username || comment.creator}
                                </h4>
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            {editingComment === comment._id ? (
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditComment(comment._id)}
                                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingComment(null)
                                                setEditContent('')
                                            }}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={() => {
                                    if (isAuthenticated && user) {
                                        toggleCommentLike(comment._id, user.userId)
                                    }
                                }}
                                disabled={!isAuthenticated}
                                className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                                    } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                                <span>{comment.likesCount}</span>
                            </button>

                            {!isReply && (
                                <button
                                    onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                                    disabled={!isAuthenticated}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Reply size={14} />
                                    <span>Reply</span>
                                </button>
                            )}

                            {isOwner && (
                                <>
                                    <button
                                        onClick={() => {
                                            setEditingComment(comment._id)
                                            setEditContent(comment.content)
                                        }}
                                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-500 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                        <span>Edit</span>
                                    </button>

                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        <span>Delete</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Reply Form */}
                        {replyTo === comment._id && (
                            <form onSubmit={(e) => handleSubmitReply(e, comment._id)} className="mt-3">
                                <div className="flex gap-2">
                                    <img
                                        src={profiles[user?.userId || '']?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'}
                                        alt="Your avatar"
                                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write a reply..."
                                            className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            rows={2}
                                        />
                                        <div className="flex justify-end space-x-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReplyTo(null)
                                                    setReplyContent('')
                                                }}
                                                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={!replyContent.trim()}
                                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Send size={12} />
                                                <span>Reply</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Replies */}
                        {getReplies(comment._id).map(reply => (
                            <div key={reply._id} className="mt-3">
                                <CommentItem comment={reply} isReply={true} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="border-t border-gray-100 p-4 gap-4">
            {/* New Comment Form */}
            {isAuthenticated && (
                <form onSubmit={handleSubmitComment} className="flex flex-col gap-3 mb-6">
                    <div className="flex space-x-3">
                        <img
                            src={profiles[user?.userId || '']?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'}
                            alt="Your avatar"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                rows={2}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} />
                            <span>Comment</span>
                        </button>
                    </div>
                </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {topLevelComments.map(comment => (
                    <CommentItem key={comment._id} comment={comment} />
                ))}

                {topLevelComments.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentsSection
