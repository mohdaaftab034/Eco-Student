import React, { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Star, Award, BookOpen, Target, ArrowLeft, Edit, Trophy, Zap, Camera, Save, X, Calendar, School, GraduationCap, TrendingUp, Clock, CheckCircle } from 'lucide-react'
// import { useAuth } from '../../hooks/useAuth'
// import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates'
// import { lumi } from '../../lib/lumi'
import toast from 'react-hot-toast'
import { userDataContext } from '../../Context/UserContext'
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates'

const StudentProfile = ({ onBack }) => {
  const { user } = useContext(userDataContext)
  const { student: realtimeStudent, refreshStudent, loading: realtimeLoading } = useRealtimeUpdates(user?._id)
  const [student, setStudent] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    grade: '',
    school: '',
    bio: '',
    favorite_subject: '',
    environmental_goal: '',
    avatar: ''
  })
  const [saving, setSaving] = useState(false)

  // Available avatar options
  const avatarOptions = [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  ]

  useEffect(() => {
    if (realtimeStudent) {
      setStudent(realtimeStudent)
      setEditForm({
        name: realtimeStudent.name || '',
        grade: realtimeStudent.grade || '',
        school: realtimeStudent.school || '',
        bio: realtimeStudent.bio || '',
        favorite_subject: realtimeStudent.favorite_subject || '',
        environmental_goal: realtimeStudent.environmental_goal || '',
        avatar: realtimeStudent.avatar || avatarOptions[0]
      })
    }
  }, [realtimeStudent])

  const handleSaveProfile = async () => {
    if (!student) return

    setSaving(true)
    try {
      await lumi.entities.students.update(student._id, {
        ...editForm,
        updated_at: new Date().toISOString()
      })

      const updatedStudent = { ...student, ...editForm }
      setStudent(updatedStudent)
      setIsEditing(false)

      await refreshStudent()

      toast.success('🎉 Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getNextLevelPoints = (currentPoints) => {
    const currentLevel = Math.floor(currentPoints / 500) + 1
    return currentLevel * 500
  }

  const getLevelProgress = (currentPoints) => {
    const currentLevelStart = (Math.floor(currentPoints / 500)) * 500
    const nextLevelStart = currentLevelStart + 500
    return ((currentPoints - currentLevelStart) / 500) * 100
  }

  const getAverageQuizScore = () => {
    if (!student?.quiz_scores || student.quiz_scores.length === 0) return 0
    const total = student?.quiz_scores.reduce((sum, score) => sum + score.score, 0)
    return Math.round(total / student?.quiz_scores.length)
  }

  const getJoinDate = () => {
    if (student?.join_date) {
      return new Date(student?.join_date).toLocaleDateString()
    }
    return 'Recently joined'
  }

  const getRecentBadges = () => {
    if (!student?.badges) return []
    return student?.badges
      .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
      .slice(0, 6)
  }

  if (realtimeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center flex flex-col gap-5 items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mb-4 mx-auto"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Show message if no user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center flex items-center justify-center gap-5 flex-col">
          <p className="text-lg text-gray-600 mb-4">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  // Show message if student profile not found - but provide option to create one
  if (!realtimeLoading && !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to EcoLearning!</h2>
            <p className="text-gray-600 mb-6">Let's create your student profile to get started on your environmental learning journey.</p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <User className="mr-2" size={16} />
                User ID: {user._id}
              </div>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Calendar className="mr-2" size={16} />
                Joined: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaff] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#fafaff] rounded-md shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-[#fafaff] rounded-md border-[1px] border-gray-300 shadow-lg p-8 text-black relative">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {/* Avatar Section */}
              <div className="relative mb-6 md:mb-0 md:mr-8">
                <img
                  src={editForm.avatar || student?.avatar || avatarOptions[0]}
                  alt={student?.name || 'Student'}
                  className="w-32 h-32 rounded-full transition-transform duration-300 ease-out hover:scale-105 object-cover border-4 border-black shadow-lg"
                />
                {isEditing && (
                  <button
                    onClick={() => {
                      // Cycle through avatar options
                      const currentIndex = avatarOptions.indexOf(editForm.avatar)
                      const nextIndex = (currentIndex + 1) % avatarOptions.length
                      setEditForm({ ...editForm, avatar: avatarOptions[nextIndex] })
                    }}
                    className="absolute bottom-2 right-2 shadow-lg bg-emerald-700 text-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 shadow-lg px-4 py-2 transition-transform duration-300 ease-out hover:scale-105 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4 flex flex-col gap-2">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-3xl font-bold bg-[#fafaff] bg-opacity-20 outline-none text-black placeholder-white placeholder-opacity-70 shadow-sm rounded-lg px-4 py-2 w-full md:w-auto"
                      placeholder="Your name"
                    />
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        value={editForm.grade}
                        onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                        className="bg-[#fafaff] bg-opacity-20 text-black outline-none placeholder-black placeholder-opacity-70 shadow-sm rounded-lg px-4 py-2"
                        placeholder="Grade (e.g., 8th Grade)"
                      />
                      <input
                        type="text"
                        value={editForm.school}
                        onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                        className="bg-[#fafaff] bg-opacity-20 text-black outline-none placeholder-black placeholder-opacity-70 shadow-sm rounded-lg px-4 py-2"
                        placeholder="School name"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-4xl font-bold text-emerald-700 mb-2">{student?.name || 'Student'}</h2>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-lg opacity-90 mb-4">
                      <div className="flex items-center">
                        <GraduationCap className="mr-2" size={20} />
                        {student?.grade || 'Grade not set'}
                      </div>
                      <div className="flex items-center">
                        <School className="mr-2" size={20} />
                        {student?.school || 'School not set'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2" size={20} />
                        {getJoinDate()}
                      </div>
                    </div>
                    {student?.bio && (
                      <p className="text-lg opacity-90 mb-4 max-w-2xl">{student.bio}</p>
                    )}
                  </div>
                )}

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
                  <div className="flex items-center bg-[#fafaff] shadow-sm bg-opacity-20 px-4 py-2 rounded-full">
                    <Zap className="mr-2" size={20} />
                    <span className="text-xl font-bold">{student?.eco_points || 0} Eco Points</span>
                  </div>
                  <div className="flex items-center bg-[#fafaff] shadow-sm bg-opacity-20 px-4 py-2 rounded-full">
                    <Trophy className="mr-2" size={20} />
                    <span className="text-xl font-bold">Level {student?.level || 1}</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-6 md:mt-0">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center bg-emerald-700 z-50 bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2 space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center bg-emerald-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save size={16} className="mr-2" />
                      )}
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Level Progress */}
          {student && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-700">Level {student.level} Progress</span>
                <span className="text-sm text-gray-600">
                  {student.eco_points} / {getNextLevelPoints(student.eco_points)} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getLevelProgress(student.eco_points)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-emerald-700 h-4 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-600">
                {getNextLevelPoints(student.eco_points) - student.eco_points} points to next level!
              </p>
            </div>
          )}
        </motion.div>

        {/* Edit Form */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#fafaff] rounded-md shadow-lg p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">✨ Customize Your Profile</h3>

              {/* Avatar Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose Your Avatar</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {avatarOptions.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setEditForm({ ...editForm, avatar })}
                      className={`relative w-16 h-16 rounded-full overflow-hidden border-4 transition-all ${editForm.avatar === avatar
                        ? 'border-green-500 scale-110'
                        : 'border-gray-200 hover:border-green-300'
                        }`}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar option ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {editForm.avatar === avatar && (
                        <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                          <CheckCircle className="text-green-600" size={20} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us about yourself and your environmental interests..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Environmental Subject</label>
                  <select
                    value={editForm.favorite_subject}
                    onChange={(e) => setEditForm({ ...editForm, favorite_subject: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="climate_change">Climate Change</option>
                    <option value="wildlife">Wildlife Conservation</option>
                    <option value="recycling">Recycling & Waste</option>
                    <option value="energy">Renewable Energy</option>
                    <option value="water">Water Conservation</option>
                    <option value="pollution">Pollution Prevention</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Environmental Goal</label>
                  <input
                    type="text"
                    value={editForm.environmental_goal}
                    onChange={(e) => setEditForm({ ...editForm, environmental_goal: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What environmental impact do you want to make? (e.g., Reduce plastic waste by 50%)"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg p-6 text-center"
          >
            <div className="bg-emerald-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-[#fafaff]" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{student?.completed_lessons?.length || 0}</h3>
            <p className="text-gray-600">Lessons Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg p-6 text-center"
          >
            <div className="bg-emerald-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-[#fafaff]" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{student?.badges?.length || 0}</h3>
            <p className="text-gray-600">Badges Earned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg p-6 text-center"
          >
            <div className="bg-emerald-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-[#fafaff]" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{student?.quiz_scores?.length || 0}</h3>
            <p className="text-gray-600">Quizzes Taken</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg p-6 text-center"
          >
            <div className="bg-emerald-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-[#fafaff]" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{getAverageQuizScore()}%</h3>
            <p className="text-gray-600">Avg Quiz Score</p>
          </motion.div>
        </div>

        {/* Additional Profile Info */}
        {!isEditing && student && (student.bio || student.favorite_subject || student.environmental_goal) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#fafaff] rounded-md shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">About Me 🌱</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {student.bio && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <User className="mr-2" size={16} />
                    Bio
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{student.bio}</p>
                </div>
              )}
              {student.favorite_subject && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Star className="mr-2" size={16} />
                    Favorite Subject
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg capitalize">
                    {student.favorite_subject.replace('_', ' ')}
                  </p>
                </div>
              )}
              {student.environmental_goal && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Target className="mr-2" size={16} />
                    Environmental Goal
                  </h4>
                  <p className="text-gray-600 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                    {student.environmental_goal}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Recent Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#fafaff] rounded-md border-[1px] border-gray-300 shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Achievements 🏆</h3>
          {student?.badges && student.badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {getRecentBadges().map((badge, index) => (
                <motion.div
                  key={badge.badge_id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-bold text-gray-800 text-sm">{badge.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(badge.earned_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Award size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No badges earned yet!</p>
              <p className="text-sm">Complete lessons and challenges to earn badges.</p>
            </div>
          )}
        </motion.div>

        {/* Recent Quiz Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#fafaff] border-[1px] border-gray-300 rounded-md shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quiz Performance 📊</h3>
          {student?.quiz_scores && student.quiz_scores.length > 0 ? (
            <div className="space-y-3">
              {student.quiz_scores.slice(0, 5).map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${score.score >= 80 ? 'bg-green-100' : score.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                      {score.score >= 80 ? '🌟' : score.score >= 60 ? '👍' : '📚'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Quiz {score.quiz_id}</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {new Date(score.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${score.score >= 80 ? 'text-green-600' :
                      score.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {score.score}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {score.score >= 80 ? 'Excellent' : score.score >= 60 ? 'Good' : 'Keep Learning'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Star size={48} className="mx-auto mb-4 text-black" />
              <p className='text-black font-bold'>No quizzes taken yet!</p>
              <p className="text-sm text-black font-light">Take quizzes to test your knowledge and earn points.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default StudentProfile;
