import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Save, X } from 'lucide-react'
import { realtimeEvents } from '../../hooks/useRealtimeUpdates'
import toast from 'react-hot-toast'
import { userDataContext } from '../../Context/UserContext'

const AddLessonsPage = ({ onBack }) => {
    const { user, axios } = useContext(userDataContext);
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingLesson, setEditingLesson] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        category: 'climate_change',
        difficulty: 'beginner',
        eco_points_reward: 10,
        estimated_duration: 15,
        media_url: ''
    })

    const categories = [
        { id: 'climate_change', name: 'Climate Change', emoji: '🌍' },
        { id: 'wildlife', name: 'Wildlife Conservation', emoji: '🦋' },
        { id: 'recycling', name: 'Recycling & Waste', emoji: '♻️' },
        { id: 'energy', name: 'Renewable Energy', emoji: '⚡' },
        { id: 'water', name: 'Water Conservation', emoji: '💧' },
        { id: 'pollution', name: 'Pollution Control', emoji: '🏭' }
    ]

    const difficulties = [
        { id: 'beginner', name: 'Beginner', color: 'bg-green-100 text-green-800' },
        { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'advanced', name: 'Advanced', color: 'bg-red-100 text-red-800' }
    ]

    const sampleMediaUrls = [
        'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
        'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg',
        'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
        'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg',
        'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg'
    ]

    useEffect(() => {
        fetchLessons()
    }, [])

    const fetchLessons = async () => {
        try {
            const res = await axios.get('/api/lessons')
            setLessons(res.data.lessons || []);
        } catch (error) {
            console.error('Failed to fetch lessons:', error)
            toast.error("Failed to load Lessons")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            const lessonData = {
                ...formData,
                teacher_id: user?._id || '',
                media_url:
                    formData.media_url ||
                    sampleMediaUrls[Math.floor(Math.random() * sampleMediaUrls.length)]
            }
            console.log(lessonData);

            if (editingLesson) {
                const res = await axios.put(`/api/lessons/${editingLesson._id}`, lessonData);

                console.log(res.data.lesson);
                setLessons(
                    lessons.map((lesson) =>
                        lesson._id === editingLesson._id ? res.data.lesson : lesson
                    )
                )
                toast.success('Lesson updated successfully!')
            } else {
                const res = await axios.post('/api/lessons', lessonData);
                setLessons([res.data.lesson, ...lessons])
                realtimeEvents.emit('lesson-created', res.data.lesson)
                toast.success('🎉 Lesson created! Students can see it now.')
            }

            cancelForm();
        } catch (error) {
            console.error('Failed to save lesson:', error)
            toast.error('Failed to save lesson')
        }
    }

    const handleEdit = (lesson) => {
        setFormData({
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            category: lesson.category,
            difficulty: lesson.difficulty,
            eco_points_reward: lesson.eco_points_reward,
            estimated_duration: lesson.estimated_duration,
            media_url: lesson.media_url
        })
        setEditingLesson(lesson)
        setShowCreateForm(true)
    }

    const handleDelete = async (lessonId) => {
        if (!confirm('Are you sure you want to delete this lesson?')) return

        try {
            await axios.delete(`/api/lessons/${lessonId}`)
            setLessons(lessons.filter((lesson) => lesson._id !== lessonId))
            realtimeEvents.emit('refresh-student-data')
            toast.success('Lesson deleted successfully')
        } catch (error) {
            console.error('Failed to delete lesson:', error)
            toast.error('Failed to delete lesson')
        }
    }

    const cancelForm = () => {
        setFormData({
            title: '',
            description: '',
            content: '',
            category: 'climate_change',
            difficulty: 'beginner',
            eco_points_reward: 10,
            estimated_duration: 15,
            media_url: ''
        })
        setShowCreateForm(false)
        setEditingLesson(null)
    }

    const getCategoryEmoji = (categoryId) => {
        const category = categories.find((c) => c.id === categoryId)
        return category ? category.emoji : '🌱'
    }

    const getDifficultyColor = (difficulty) => {
        const diff = difficulties.find((d) => d.id === difficulty)
        return diff ? diff.color : 'bg-gray-100 text-gray-800'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-lg text-gray-600">Loading lessons...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-blue-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={onBack}
                                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Dashboard
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Manage Lessons</h1>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="flex items-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors"
                        >
                            <Plus size={20} className="mr-2" />
                            Create New Lesson
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Form */}
                {showCreateForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-6 mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
                            </h2>
                            <button onClick={cancelForm} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lesson Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter lesson title"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.emoji} {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty Level
                                    </label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {difficulties.map((difficulty) => (
                                            <option key={difficulty.id} value={difficulty.id}>
                                                {difficulty.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estimated Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.estimated_duration}
                                        onChange={(e) =>
                                            setFormData({ ...formData, estimated_duration: parseInt(e.target.value) })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="5"
                                        max="120"
                                    />
                                </div>

                                {/* Eco Points */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Eco Points Reward
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.eco_points_reward}
                                        onChange={(e) =>
                                            setFormData({ ...formData, eco_points_reward: parseInt(e.target.value) })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="5"
                                        max="100"
                                    />
                                </div>

                                {/* Media URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Media URL (optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.media_url}
                                        onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Leave empty to use a random environmental image
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Short Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief description of the lesson"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lesson Content *
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Write the full lesson content here..."
                                    required
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={cancelForm}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors"
                                >
                                    <Save size={16} className="mr-2" />
                                    {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Lessons List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Your Lessons ({lessons.length})</h2>
                            <div className="text-sm text-gray-600">
                                💡 Students see new lessons instantly on their dashboards
                            </div>
                        </div>
                    </div>

                    {lessons.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen size={64} className="mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-bold text-gray-600 mb-2">No lessons created yet</h3>
                            <p className="text-gray-500 mb-4">
                                Create your first environmental lesson to get started!
                            </p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors"
                            >
                                <Plus size={16} className="mr-2" />
                                Create First Lesson
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {console.log("Lessons list:", lessons)}
                            {lessons.map((lesson, index) => (
                                <motion.div
                                    key={lesson._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <span className="text-2xl mr-3">{getCategoryEmoji(lesson.category)}</span>
                                                <h3 className="text-lg font-bold text-gray-800">{lesson.title}</h3>
                                                <span
                                                    className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                                        lesson.difficulty
                                                    )}`}
                                                >
                                                    {lesson.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>⏱️ {lesson.estimated_duration} min</span>
                                                <span>⭐ {lesson.eco_points_reward} points</span>
                                                <span>📅 {new Date(lesson.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(lesson)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Edit lesson"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lesson._id)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Delete lesson"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddLessonsPage
