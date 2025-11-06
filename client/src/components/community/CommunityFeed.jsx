import React from 'react'
import PostCard from './PostCard'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import CreatePostForm from './CreatePostForm'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'

const Feed = () => {
    const { user, isAuthenticated, signIn } = useAuth()
    const { posts, loading, createPost, updatePost, deletePost, toggleLike, fetchPosts } = usePosts();
    const navigate = useNavigate();

    const handleCreatePost = async (content, imageUrl) => {
        if (!isAuthenticated || !user) return
        await createPost(content, imageUrl, user.userId, user.userName || 'Anonymous')
    }

    const handleEditPost = async (postId, content) => {
        await updatePost(postId, { content })
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#fafaff] flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-[#fafaff] rounded-xl shadow-lg p-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">C</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome to Community
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Join our vibrant community to share posts, connect with others, and engage in meaningful conversations.
                        </p>
                        <button
                            onClick={signIn}
                            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                            Sign In to Get Started
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-[#fafaff]'>
            <Navbar />
            <div className="min-h-screen bg-[#fafaff]">
                <div className="max-w-2xl mx-auto px-4 py-6">
                    <button onClick={() => navigate('/student')} className="mb-4 cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                       <ArrowLeft className='w-6 h-6 bg-white shadow p-2 '/> Go to Dashboard
                    </button>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Community Feed</h1>
                        <button
                            onClick={fetchPosts}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-600 transition-colors"
                        >
                            <RefreshCw size={18} />
                            <span>Refresh</span>
                        </button>
                    </div>

                    {/* Create Post Form */}
                    <div className="mb-6">
                        <CreatePostForm onSubmit={handleCreatePost} />
                    </div>

                    {/* Posts Feed */}
                    <div className=" flex flex-col gap-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onLike={toggleLike}
                                    onEdit={handleEditPost}
                                    onDelete={deletePost}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-gray-400 text-xl">📝</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No posts yet
                                </h3>
                                <p className="text-gray-600">
                                    Be the first to share something with the community!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feed
