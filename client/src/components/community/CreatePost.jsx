import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import CreatePostForm from './CreatePostForm'
import { usePosts } from '../../hooks/usePosts'
import { useAuth } from '../../hooks/useAuth'
import Navbar from './Navbar'

const CreatePost = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const { createPost } = usePosts()

    const handleCreatePost = async (content, imageUrl) => {
        if (!isAuthenticated || !user) return

        await createPost(content, imageUrl, user.userId, user.userName || 'Anonymous')
        navigate('/')
    }

    
    return (
        <div className="min-h-screen bg-[#fafaff]">
            <Navbar/>
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                    <button
                        onClick={() => navigate('/feed')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Feed</span>
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Post</h1>
                    <p className="text-gray-600">
                        Share your thoughts, experiences, or questions with the community
                    </p>
                </div>

                {/* Create Post Form */}
                <CreatePostForm
                    onSubmit={handleCreatePost}
                    onCancel={() => navigate('/')}
                />
            </div>
        </div>
    )
}

export default CreatePost
