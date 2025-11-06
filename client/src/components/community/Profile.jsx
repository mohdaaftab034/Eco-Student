import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import PostCard from './PostCard'
import { Edit2, MapPin, Globe, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useUserProfiles } from '../../hooks/useUserProfile'
import Navbar from './Navbar'

const Profile = () => {
  const { user, isAuthenticated, signIn } = useAuth()
  const { profiles, fetchProfile, createProfile, updateProfile } = useUserProfiles()
  const { posts, toggleLike, updatePost, deletePost } = usePosts()
  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({
    username: '',
    bio: '',
    location: '',
    website: ''
  })

  const userProfile = user ? profiles[user.userId] : null
  const userPosts = posts.filter(post => user && post.user_id === user.userId)

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchProfile(user.userId).then(profile => {
        if (!profile) {
          // Create initial profile
          createProfile({
            user_id: user.userId,
            username: user.userName || 'Anonymous',
            bio: '',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
            postsCount: 0,
            followersCount: 0,
            followingCount: 0,
            location: '',
            website: '',
            creator: user.userName || 'Anonymous'
          })
        }
      })
    }
  }, [user, isAuthenticated, fetchProfile, createProfile])

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        username: userProfile.username || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        website: userProfile.website || ''
      })
    }
  }, [userProfile])

  const handleSaveProfile = async () => {
    if (!user || !userProfile) return
    await updateProfile(user.userId, profileForm)
    setIsEditing(false)
  }

  const handleEditPost = async (postId, content) => {
    await updatePost(postId, { content })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your profile
          </h1>
          <button
            onClick={signIn}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaff]">
        <Navbar/>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={userProfile?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
            />

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Username"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Bio"
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                  />
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Location"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="Website"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userProfile?.username || user.userName || 'Anonymous'}
                  </h1>

                  {userProfile?.bio && (
                    <p className="text-gray-600 mt-2 max-w-2xl">
                      {userProfile.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-gray-500">
                    {userProfile?.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>{userProfile.location}</span>
                      </div>
                    )}

                    {userProfile?.website && (
                      <div className="flex items-center space-x-1">
                        <Globe size={16} />
                        <a
                          href={userProfile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700"
                        >
                          Website
                        </a>
                      </div>
                    )}

                    {userProfile?.createdAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>
                          Joined {formatDistanceToNow(new Date(userProfile.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center md:justify-start space-x-6 mt-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {userPosts.length}
                      </div>
                      <div className="text-sm text-gray-500">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {userProfile?.followersCount || 0}
                      </div>
                      <div className="text-sm text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {userProfile?.followingCount || 0}
                      </div>
                      <div className="text-sm text-gray-500">Following</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* User Posts */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Your Posts</h2>

          {userPosts.length > 0 ? (
            userPosts.map(post => (
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
              <p className="text-gray-600 mb-4">
                Start sharing your thoughts with the community!
              </p>
              <button
                onClick={() => (window.location.href = '/create')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
