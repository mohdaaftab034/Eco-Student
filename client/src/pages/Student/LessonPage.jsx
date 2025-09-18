import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, CheckCircle, Clock, Star, Award, BookOpen, Target, BookUser, BookDashed } from 'lucide-react'
// import { useAuth } from '../../hooks/useAuth'
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates'
// import { lumi } from '../../lib/lumi'
import toast from 'react-hot-toast'
import { userDataContext } from '../../Context/UserContext'
import Footer from '../../components/Footer'

const LessonPage = ({ onBack }) => {
    const { user, axios, token } = useContext(userDataContext)
    const { student, updateStudentPoints, updateStudentBadges } = useRealtimeUpdates(user?._id)

    const [lessons, setLessons] = useState([])
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')
    const [lastLessonCount, setLastLessonCount] = useState(0)

    // Badge system for lesson achievements
    const availableBadges = [
        {
            badge_id: 'first_lesson',
            name: 'First Steps',
            icon: '👶',
            points_required: 10,
            requirement: 'Complete your first lesson',
            category: 'learning'
        },
        {
            badge_id: 'lesson_master',
            name: 'Lesson Master',
            icon: '📚',
            points_required: 100,
            requirement: 'Complete 5 lessons',
            category: 'learning'
        },
        {
            badge_id: 'eco_warrior',
            name: 'Eco Warrior',
            icon: '🌟',
            points_required: 50,
            requirement: 'Earn 50 eco points',
            category: 'achievement'
        },
        {
            badge_id: 'climate_champion',
            name: 'Climate Champion',
            icon: '🌍',
            points_required: 400,
            requirement: 'Earn 400 eco points',
            category: 'learning'
        }
    ]

    const categories = [
        { id: 'all', name: 'All Categories', emoji: '🌱' },
        { id: 'climate_change', name: 'Climate Change', emoji: '🌍' },
        { id: 'wildlife', name: 'Wildlife', emoji: '🦋' },
        { id: 'recycling', name: 'Recycling', emoji: '♻️' },
        { id: 'energy', name: 'Energy', emoji: '⚡' },
        { id: 'water', name: 'Water', emoji: '💧' },
        { id: 'pollution', name: 'Pollution', emoji: '🏭' }
    ]

    const difficulties = [
        { id: 'all', name: 'All Levels' },
        { id: 'beginner', name: 'Beginner' },
        { id: 'intermediate', name: 'Intermediate' },
        { id: 'advanced', name: 'Advanced' }
    ]

    useEffect(() => {
        fetchLessons()
    }, [])

    const fetchLessons = async () => {
        try {
            const res = await axios.get("/api/content/lessons?sort=-createdAt");
            const { list, total } = res.data;

            setLessons(list || []);
            if (lastLessonCount === 0) {
                setLastLessonCount(total || 0);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch lessons:", error);
        }
    };

    const completeLesson = async (lesson) => {
        if (!student) return

        try {
            const updatedLessons = [...(student.completed_lessons || []), lesson._id]

            // 🔹 Backend API ko call karke lesson completion update karo
            const res = await axios.put(`/api/students/${student._id}/lessons`, {
                completed_lessons: updatedLessons,
                eco_points_reward: lesson.eco_points_reward,

            })

            const updatedStudent = res.data // backend se updated student object aa jayega

            // 🔹 Check for new badges BEFORE updating points
            const newBadges = checkForNewBadges(
                updatedStudent.eco_points,
                updatedStudent.completed_lessons.length,
                updatedStudent.badges || []
            )

            // 🔹 Real-time points system
            await updateStudentPoints(lesson.eco_points_reward, "Lesson completed!")

            // 🔹 Badges update if any
            if (newBadges.length > 0) {
                await updateStudentBadges(newBadges)

                setTimeout(() => {
                    toast.success(
                        `🏆 New badge${newBadges.length > 1 ? "s" : ""} earned! Check your badges section!`,
                        {
                            duration: 4000,
                            onClick: () => {
                                window.dispatchEvent(
                                    new CustomEvent("openBadgesPage", { detail: { newBadges } })
                                )
                            }
                        }
                    )
                }, 2000)
            }

            // Close lesson view
            setSelectedLesson(null)

        } catch (error) {
            console.error(error)
            toast.error("Failed to complete lesson")
        }
    }


    const checkForNewBadges = (points, lessonsCompleted, currentBadges) => {
        const earnedBadgeIds = currentBadges.map(badge => badge.badge_id)
        const newBadges = []

        for (const badge of availableBadges) {
            if (earnedBadgeIds.includes(badge.badge_id)) continue

            let shouldEarn = false

            switch (badge.badge_id) {
                case 'first_lesson':
                    shouldEarn = lessonsCompleted >= 1
                    break
                case 'lesson_master':
                    shouldEarn = lessonsCompleted >= 5
                    break
                default:
                    shouldEarn = points >= badge.points_required
            }

            if (shouldEarn) {
                newBadges.push({
                    badge_id: badge.badge_id,
                    name: badge.name,
                    icon: badge.icon,
                    earned_at: new Date().toISOString()
                })
            }
        }

        return newBadges
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-100 text-green-800'
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800'
            case 'advanced':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-black'
        }
    }

    const getCategoryEmoji = (category) => {
        const found = categories.find(c => c.id === category)
        return found ? found.emoji : '🌱'
    }

    const isCompleted = (lessonId) => {
        return student?.completed_lessons?.includes(lessonId) || false
    }


    const filteredLessons = lessons.filter(lesson => {
        const categoryMatch = selectedCategory === 'all' || lesson.category === selectedCategory
        const difficultyMatch = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty
        return categoryMatch && difficultyMatch
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafaff] flex items-center justify-center">
                <div className="text-center flex justify-center items-center gap-5 flex-col">
                    <div className="animate-spin rounded-full h-16 w-16 border-black mb-4"></div>
                    <p className="text-lg text-gray-600">Loading lessons...</p>
                </div>
            </div>
        )
    }

    // Lesson Detail View
    if (selectedLesson) {
        const completed = isCompleted(selectedLesson._id)

        return (
            <div className="min-h-screen bg-[#fafaff]">
                {/* Header */}
                <header className="bg-[#fafaff] sticky top-0 z-50 shadow-lg">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <button
                                onClick={() => setSelectedLesson(null)}
                                className="flex items-center text-black hover:text-green-600 transition-colors"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Lessons
                            </button>
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedLesson.difficulty)}`}>
                                    {selectedLesson.difficulty}
                                </span>
                                <div className="flex items-center text-green-600">
                                    <Star size={16} className="mr-1" />
                                    <span className="font-bold">{selectedLesson.eco_points_reward} points</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#fafaff] rounded-md shadow-lg overflow-hidden"
                    >
                        <img
                            src={selectedLesson.media_url}
                            alt={selectedLesson.title}
                            className="w-full h-64 object-cover"
                        />

                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <span className="text-3xl mr-3">{getCategoryEmoji(selectedLesson.category)}</span>
                                    <div>
                                        <h1 className="text-3xl font-bold text-black mb-2">{selectedLesson.title}</h1>
                                        <p className="text-gray-600">{selectedLesson.description}</p>
                                    </div>
                                </div>
                                {completed && (
                                    <div className="flex items-center text-green-600">
                                        <CheckCircle size={24} className="mr-2" />
                                        <span className="font-bold">Completed</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <Clock className="mx-auto mb-2 text-blue-600" size={24} />
                                    <div className="font-bold text-blue-800">{selectedLesson.estimated_duration} min</div>
                                    <div className="text-sm text-blue-600">Duration</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <Star className="mx-auto mb-2 text-green-600" size={24} />
                                    <div className="font-bold text-green-800">{selectedLesson.eco_points_reward} points</div>
                                    <div className="text-sm text-green-600">Reward</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <Target className="mx-auto mb-2 text-purple-600" size={24} />
                                    <div className="font-bold text-purple-800">{selectedLesson.difficulty}</div>
                                    <div className="text-sm text-purple-600">Level</div>
                                </div>
                            </div>

                            <div className="prose max-w-none mb-8">
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedLesson.content}
                                </div>
                            </div>

                            <div className="text-center">
                                {completed ? (
                                    <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg inline-flex items-center">
                                        <CheckCircle size={20} className="mr-2" />
                                        Lesson Completed - {selectedLesson.eco_points_reward} points earned!
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => completeLesson(selectedLesson)}
                                        className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-black/50 transition-colors flex items-center mx-auto"
                                    >
                                        <Award size={20} className="mr-2" />
                                        Complete Lesson & Earn {selectedLesson.eco_points_reward} Points
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    // Main Lessons List
    return (
        <div className="min-h-screen bg-[#fafaff]">
            <header className="bg-[#fafaff] sticky top-0 z-50 shadow-lg ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={onBack}
                                className="flex items-center text-green-800 hover:text-green-700 transition-colors mr-4"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Dashboard
                            </button>
                            <h1 className="text-2xl font-bold text-black font-fredoka">Environmental Lessons</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {student && (
                                <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full">
                                    <span className="font-bold text-green-800">
                                        {student.completed_lessons?.length || 0} / {lessons.length} Completed
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#fafaff] text-black transition-transform duration-300 hover:scale-105 ease-in-out rounded-md p-6 mb-8 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl flex justify-start gap-2 items-center font-bold mb-2 font-fredoka">Learn & Earn! <BookDashed className='h-6 w-6'/> </h2>
                            <p className="text-light opacity-90">
                                Complete environmental lessons to earn eco points and unlock badges!
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-6xl animate-bounce">🌱</div>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="bg-[#fafaff] rounded-md shadow-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Category Filter */}
                        <div>
                            <h3 className="text-lg font-bold text-black mb-3">Category</h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center px-3 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span className="mr-2">{category.emoji}</span>
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <h3 className="text-lg font-bold text-black mb-3">Difficulty</h3>
                            <div className="flex flex-wrap gap-2">
                                {difficulties.map((difficulty) => (
                                    <button
                                        key={difficulty.id}
                                        onClick={() => setSelectedDifficulty(difficulty.id)}
                                        className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors ${selectedDifficulty === difficulty.id
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {difficulty.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson, index) => {
                        const completed = isCompleted(lesson._id)

                        return (
                            <motion.div
                                key={lesson._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className={`bg-white rounded-md shadow-lg overflow-hidden border-1 transition-all ${completed ? 'border-green-200 bg-gray-50' : 'border-gray-100 hover:border-black'
                                    }`}
                            >
                                <div className="relative">
                                    <img
                                        src={lesson.media_url}
                                        alt={lesson.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    {completed && (
                                        <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full">
                                            <CheckCircle size={20} />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl">{getCategoryEmoji(lesson.category)}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                                            {lesson.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-black mb-2">{lesson.title}</h3>
                                    <p className="text-black font-light text-sm mb-4 line-clamp-3">{lesson.description}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="mr-1" size={16} />
                                            {lesson.estimated_duration} min
                                        </div>
                                        <div className="flex items-center text-sm text-green-600">
                                            <Star className="mr-1" size={16} />
                                            {lesson.eco_points_reward} points
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedLesson(lesson)}
                                        className={`w-full py-2 rounded-md cursor-pointer font-medium transition-colors flex items-center justify-center ${completed
                                            ? 'bg-green-100 text-black hover:bg-green-200'
                                            : 'bg-black text-white hover:bg-gray-900'
                                            }`}
                                    >
                                        {completed ? (
                                            <>
                                                <CheckCircle size={16} className="mr-2" />
                                                Review Lesson
                                            </>
                                        ) : (
                                            <>
                                                <Play size={16} className="mr-2" />
                                                Start Lesson
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {filteredLessons.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen size={64} className="mx-auto mb-4 text-black" />
                        <h3 className="text-xl font-bold text-black mb-2">No lessons found</h3>
                        <p className="text-black font-light">Try adjusting your filters or check back later for new content!</p>
                    </div>
                )}
            </div>

            {/* Footer  */}
            <Footer />
        </div>
    )
}

export default LessonPage
