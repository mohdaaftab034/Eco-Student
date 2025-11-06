import React, { useState, useEffect } from 'react'
import { Heart, MessageCircleDashed as MessageCircle, Edit2, Trash2, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../../hooks/useAuth'
import { useUserProfiles } from '../../hooks/useUserProfile'
import CommentsSection from './CommentSection'

const PostCard = ({ post, onLike, onEdit, onDelete }) => {
    const { user, isAuthenticated } = useAuth()
    const { profiles, fetchProfile } = useUserProfiles()
    const [showComments, setShowComments] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(post.content)

    const profile = profiles[post.user_id]
    const isLiked = user ? post.likes.includes(user.userId) : false
    const isOwner = user?.userId === post.user_id

    useEffect(() => {
        fetchProfile(post.user_id)
    }, [post.user_id, fetchProfile])

    const handleLike = () => {
        if (!isAuthenticated || !user) return
        onLike(post._id, user.userId)
    }

    const handleEdit = () => {
        if (onEdit) {
            onEdit(post._id, editContent)
            setIsEditing(false)
        }
    }

    const handleDelete = () => {
        if (onDelete && window.confirm('Are you sure you want to delete this post?')) {
            onDelete(post._id)
        }
    }

    return (
        <div className="bg-[#fafaff] rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={profile?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'}
                        alt={profile?.username || post.creator}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {profile?.username || post.creator}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <MoreHorizontal size={20} className="text-gray-500" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                <button
                                    onClick={() => {
                                        setIsEditing(true)
                                        setShowMenu(false)
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit2 size={16} className="mr-2" />
                                    Edit Post
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete()
                                        setShowMenu(false)
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {isEditing ? (
                    <div className="flex flex-col gap-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows={4}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditContent(post.content)
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>
                )}
            </div>

            {/* Image */}
            {post.imageUrl && (
                <div className="px-4 pb-4">
                    <img
                        src={post.imageUrl}
                        alt="Post content"
                        className="w-full h-64 object-cover rounded-lg"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            disabled={!isAuthenticated}
                            className={`flex items-center space-x-2 transition-colors ${isLiked
                                    ? 'text-red-500'
                                    : 'text-gray-500 hover:text-red-500'
                                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                            <span className="text-sm font-medium">{post.likesCount}</span>
                        </button>

                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                        >
                            <MessageCircle size={20} />
                            <span className="text-sm font-medium">{post.commentsCount}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <CommentsSection postId={post._id} />
            )}
        </div>
    )
}

export default PostCard
