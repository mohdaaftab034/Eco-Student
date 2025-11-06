import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { users } from '../Data/Mockdata.json';

export default function PostDetails({
    post,
    onBack,
    onLike,
    onComment,
    onShare,
    currentUserId
}) {
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    const isLiked = post.likes.some(like => like.userId === currentUserId);
    const currentUser = users.find(u => u.id === currentUserId);

    const getRoleColor = (role) => {
        switch (role) {
            case 'Student': return 'bg-blue-100 text-blue-800';
            case 'Teacher': return 'bg-purple-100 text-purple-800';
            case 'NGO': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onComment(post.id, newComment.trim());
            setNewComment('');
        }
    };

    const handleSubmitReply = (e, parentId) => {
        e.preventDefault();
        if (replyContent.trim()) {
            onComment(post.id, replyContent.trim(), parentId);
            setReplyContent('');
            setReplyTo(null);
        }
    };

    const renderComment = (comment, depth = 0) => (
        <div key={comment.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''} mb-4`}>
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                        <img
                            src={comment.user.avatar}
                            alt={comment.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                            <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900 text-sm">{comment.user.name}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(comment.user.role)}`}>
                                    {comment.user.role}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">{formatDistanceToNow(comment.createdAt)} ago</p>
                        </div>
                    </div>
                </div>

                <p className="text-gray-700 mb-3">{comment.content}</p>

                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                        <span>{comment.likes.length}</span>
                    </button>
                    <button
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        className="text-sm text-gray-500 hover:text-blue-500"
                    >
                        Reply
                    </button>
                </div>

                {/* Reply Form */}
                {replyTo === comment.id && currentUser && (
                    <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
                        <div className="flex space-x-3">
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Reply to ${comment.user.name}...`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    rows={2}
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setReplyTo(null);
                                            setReplyContent('');
                                        }}
                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!replyContent.trim()}
                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* Nested Replies */}
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Feed</span>
            </button>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Post Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4 mb-4">
                        <img
                            src={post.user.avatar}
                            alt={post.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900">{post.user.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(post.user.role)}`}>
                                    {post.user.role}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">{formatDistanceToNow(post.createdAt)} ago</p>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
                    <p className="text-gray-700 leading-relaxed">{post.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full hover:bg-green-100 cursor-pointer transition-colors"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Media */}
                {post.media && post.media.length > 0 && (
                    <div className="px-6 py-4">
                        <img
                            src={post.media[0].url}
                            alt="Post media"
                            className="w-full rounded-lg object-cover max-h-96"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => onLike(post.id)}
                            className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{post.likes.length}</span>
                        </button>

                        <div className="flex items-center space-x-2 text-gray-600">
                            <MessageCircle className="w-6 h-6" />
                            <span className="font-medium">{post.comments.length}</span>
                        </div>

                        <button
                            onClick={() => onShare(post.id)}
                            className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
                        >
                            <Share2 className="w-6 h-6" />
                            <span className="font-medium">{post.shares}</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="px-6 py-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Comments ({post.comments.length})
                    </h3>

                    {/* Add Comment Form */}
                    {currentUser && (
                        <form onSubmit={handleSubmitComment} className="mb-6">
                            <div className="flex space-x-4">
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={3}
                                    />
                                    <div className="flex justify-end mt-3">
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim()}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>Comment</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {post.comments.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                            </div>
                        ) : (
                            post.comments.map(comment => renderComment(comment))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
