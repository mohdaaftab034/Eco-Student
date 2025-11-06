import React, { useState } from 'react'
import { Image, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const CreatePostForm = ({ onSubmit, onCancel }) => {
    const { user } = useAuth()
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        try {
            await onSubmit(content.trim(), imageUrl.trim() || undefined)
            setContent('')
            setImageUrl('')
        } catch (error) {
            console.error('Failed to create post:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-[#fafaff] rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 cursor-pointer space-x-3 mb-4">
                <img
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {user?.userName || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-gray-500">Share something with the community</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-3">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind? Share your thoughts, experiences, or ask questions..."
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    maxLength={2000}
                />

                <div className="space-y-3 flex flex-col gap-3">
                    <div className="flex items-center gap-2 space-x-2">
                        <Image size={20} className="text-gray-500" />
                        <span className="text-sm text-gray-700">Add an image (optional)</span>
                    </div>

                    <div className="flex gap-2 space-x-2">
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Paste image URL here..."
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {imageUrl && (
                            <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                className="p-3 text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {imageUrl && (
                        <div className="mt-3">
                            <img
                                src={imageUrl}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                                onError={() => setImageUrl('')}
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {content.length}/2000 characters
                    </div>

                    <div className="flex gap-3 space-x-3">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreatePostForm
