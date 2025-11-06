import React, { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Award, Lock, Share2, Instagram, Twitter, Linkedin, Facebook,
    MessageCircleDashed as MessageCircle, Copy, Check, Zap
} from 'lucide-react'
import toast from 'react-hot-toast'
import { userDataContext } from '../../Context/UserContext'

const BadgesPage = ({ onBack, newlyEarnedBadges = [], onClearNewBadges }) => {
    const { user, axios, token } = useContext(userDataContext)
    const [student, setStudent] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [loading, setLoading] = useState(true)
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const [selectedBadge, setSelectedBadge] = useState(null)
    const [copiedLink, setCopiedLink] = useState(false)
    const [showCelebration, setShowCelebration] = useState(false)

    const allBadges = [
        { id: 'first_lesson', name: 'First Steps', description: 'Complete your first environmental lesson', icon: '👶', requirement: 'Complete 1 lesson', points_required: 10, category: 'learning', rarity: 'common' },
        { id: 'eco_warrior', name: 'Eco Warrior', description: 'Earn your first 50 eco points', icon: '🌟', requirement: 'Earn 50 eco points', points_required: 50, category: 'achievement', rarity: 'common' },
        { id: 'lesson_master', name: 'Lesson Master', description: 'Complete 5 environmental lessons', icon: '📚', requirement: 'Complete 5 lessons', points_required: 100, category: 'learning', rarity: 'rare' },
        { id: 'recycling_hero', name: 'Recycling Hero', description: 'Master the art of recycling', icon: '♻️', requirement: 'Complete recycling lessons', points_required: 150, category: 'recycling', rarity: 'common' },
        { id: 'water_saver', name: 'Water Saver', description: 'Learn about water conservation', icon: '💧', requirement: 'Earn 200 eco points', points_required: 200, category: 'conservation', rarity: 'rare' },
        { id: 'energy_saver', name: 'Energy Saver', description: 'Reduce energy consumption', icon: '⚡', requirement: 'Complete energy lessons', points_required: 250, category: 'energy', rarity: 'rare' },
        { id: 'tree_planter', name: 'Tree Planter', description: 'Plant a tree for the environment', icon: '🌳', requirement: 'Earn 300 eco points', points_required: 300, category: 'action', rarity: 'rare' },
        { id: 'climate_champion', name: 'Climate Champion', description: 'Master climate change knowledge', icon: '🌍', requirement: 'Earn 400 eco points', points_required: 400, category: 'learning', rarity: 'epic' },
        { id: 'wildlife_protector', name: 'Wildlife Protector', description: 'Defend endangered species', icon: '🦋', requirement: 'Earn 500 eco points', points_required: 500, category: 'action', rarity: 'epic' },
        { id: 'green_leader', name: 'Green Leader', description: 'Lead environmental initiatives', icon: '👑', requirement: 'Earn 1000 eco points', points_required: 1000, category: 'leadership', rarity: 'legendary' },
        { id: 'earth_guardian', name: 'Earth Guardian', description: 'Ultimate environmental protector', icon: '🛡️', requirement: 'Earn 2000 eco points', points_required: 2000, category: 'achievement', rarity: 'legendary' },
        { id: 'quiz_master', name: 'Quiz Master', description: 'Excel in environmental knowledge', icon: '🧠', requirement: 'Complete 5 quizzes with 80%+ score', points_required: 350, category: 'learning', rarity: 'epic' },
        { id: 'pollution_fighter', name: 'Pollution Fighter', description: 'Fight against pollution', icon: '🚫', requirement: 'Complete pollution reduction activities', points_required: 300, category: 'action', rarity: 'rare' },
        { id: 'ocean_protector', name: 'Ocean Protector', description: 'Protect marine life', icon: '🐋', requirement: 'Join ocean cleanup campaign', points_required: 400, category: 'action', rarity: 'epic' }
    ]

    const categories = [
        { id: 'all', name: 'All Badges', icon: '🏆' },
        { id: 'learning', name: 'Learning', icon: '📚' },
        { id: 'action', name: 'Action', icon: '🎯' },
        { id: 'conservation', name: 'Conservation', icon: '🌱' },
        { id: 'recycling', name: 'Recycling', icon: '♻️' },
        { id: 'energy', name: 'Energy', icon: '⚡' },
        { id: 'leadership', name: 'Leadership', icon: '👑' },
        { id: 'achievement', name: 'Achievement', icon: '🏅' }
    ]

    useEffect(() => {
        fetchStudentData()
    }, [user])

    useEffect(() => {
        if (newlyEarnedBadges.length > 0) {
            setShowCelebration(true)
            setTimeout(() => {
                setShowCelebration(false)
                if (onClearNewBadges) onClearNewBadges()
            }, 3000)
        }
    }, [newlyEarnedBadges, onClearNewBadges])

    const fetchStudentData = async () => {
        try {
            const res = await axios.get(`/api/students/${user?.user_id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });


            console.log(res.data);
            if (res.data?.success && res.data.student) {
                setStudent(res.data.student || res.data);
            }
        } catch (error) {
            console.error('Failed to fetch student data:', error)
        } finally {
            setLoading(false)
        }
    }

    const isEarned = badgeId => student?.badges?.some(badge => badge.badge_id === badgeId) || false
    const isNewlyEarned = badgeId => newlyEarnedBadges.some(badge => badge.badge_id === badgeId)
    const canEarn = badge => student && student.eco_points >= badge.points_required
    const getEarnedDate = badgeId => {
        const badge = student?.badges?.find(badge => badge.badge_id === badgeId)
        return badge ? new Date(badge.earned_at).toLocaleDateString() : null
    }

    const getRarityColor = rarity => ({
        common: 'from-gray-400 to-gray-600',
        rare: 'from-blue-400 to-blue-600',
        epic: 'from-purple-400 to-purple-600',
        legendary: 'from-yellow-400 to-orange-500'
    }[rarity] || 'from-gray-400 to-gray-600')

    const getRarityBorder = rarity => ({
        common: 'border-gray-300',
        rare: 'border-blue-300',
        epic: 'border-purple-300',
        legendary: 'border-yellow-300'
    }[rarity] || 'border-gray-300')

    const generateShareText = badge => {
        const studentName = student?.name || user?.fullName || 'I'
        return `🎉 ${studentName} just earned the "${badge.name}" badge on EcoLearn! ${badge.icon}\n\n${badge.description}\n\nJoin me in saving our planet! 🌍 #EcoLearn #Environment #SaveThePlanet #${badge.name.replace(/\s+/g, '')}`
    }

    const generateShareUrl = () => window.location.origin

    const shareOnTwitter = badge => {
        const text = generateShareText(badge)
        const url = generateShareUrl()
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
        toast.success('Shared on Twitter! 🐦')
    }

    const shareOnLinkedIn = badge => {
        const title = `${badge.name} Badge Earned!`
        const summary = generateShareText(badge)
        const url = generateShareUrl()
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`, '_blank', 'width=600,height=400')
        toast.success('Shared on LinkedIn! 💼')
    }

    const shareOnFacebook = badge => {
        const url = generateShareUrl()
        const quote = generateShareText(badge)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`, '_blank', 'width=600,height=400')
        toast.success('Shared on Facebook! 📘')
    }

    const shareOnWhatsApp = badge => {
        const text = generateShareText(badge)
        const url = generateShareUrl()
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank')
        toast.success('Shared on WhatsApp! 💚')
    }

    const shareOnInstagram = badge => {
        const text = generateShareText(badge)
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Text copied! Open Instagram and paste in your story or post 📸')
            window.open('https://www.instagram.com/', '_blank')
        }).catch(() => toast.error('Failed to copy text'))
    }

    const copyShareLink = badge => {
        const text = generateShareText(badge)
        const url = generateShareUrl()
        navigator.clipboard.writeText(`${text}\n\n${url}`).then(() => {
            setCopiedLink(true)
            toast.success('Share text copied to clipboard! 📋')
            setTimeout(() => setCopiedLink(false), 2000)
        }).catch(() => toast.error('Failed to copy text'))
    }

    const openShareModal = badge => {
        setSelectedBadge(badge)
        setShareModalOpen(true)
    }

    const closeShareModal = () => {
        setShareModalOpen(false)
        setSelectedBadge(null)
        setCopiedLink(false)
    }

    const filteredBadges = selectedCategory === 'all'
        ? allBadges
        : allBadges.filter(badge => badge.category === selectedCategory)

    const earnedCount = allBadges.filter(badge => isEarned(badge.id)).length
    const totalCount = allBadges.length

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafaff] flex items-center justify-center">
                <div className="text-center flex flex-col justify-center items-center gap-5">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mb-4"></div>
                    <p className="text-lg text-gray-600">Loading badges...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafaff]">
            {/* Celebration Overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-100 pointer-events-none"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="text-center"
                        >
                            <div className="text-8xl mb-4">🎉</div>
                            <h2 className="text-4xl font-bold text-[#fafaff] mb-2 font-fredoka">
                                New Badge{newlyEarnedBadges.length > 1 ? 's' : ''} Earned!
                            </h2>
                            <div className="flex justify-center space-x-4">
                                {newlyEarnedBadges.map((badge, index) => (
                                    <motion.div
                                        key={badge.badge_id}
                                        initial={{ scale: 0, y: 50 }}
                                        animate={{ scale: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="text-6xl"
                                    >
                                        {badge.icon}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Confetti Effect */}
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    y: -100,
                                    x: Math.random() * window.innerWidth,
                                    rotate: 0
                                }}
                                animate={{
                                    y: window.innerHeight + 100,
                                    rotate: 360
                                }}
                                transition={{
                                    duration: 3,
                                    delay: Math.random() * 2,
                                    ease: "linear"
                                }}
                                className="absolute text-2xl pointer-events-none"
                            >
                                {['🎉', '✨', '🌟', '🏆', '🎊'][Math.floor(Math.random() * 5)]}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-[#fafaff] sticky top-0 z-50 shadow-lg">
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
                            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">My Badges</h1>
                            {newlyEarnedBadges.length > 0 && (
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="ml-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                                >
                                    🎉 NEW!
                                </motion.span>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full">
                                <span className="font-bold text-green-800">{earnedCount}/{totalCount} Earned</span>
                            </div>
                            {student && (
                                <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
                                    <span className="font-bold text-purple-800">{student.eco_points} Points</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#fafaff] rounded-md p-6 mb-8 text-black shadow-lg relative overflow-hidden"
                >
                    {newlyEarnedBadges.length > 0 && (
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute top-4 right-4 text-4xl"
                        >
                            ✨
                        </motion.div>
                    )}

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 font-fredoka">Badge Collection 🏆</h2>
                            <p className="text-lg opacity-90">
                                Collect badges by completing lessons, quizzes, and environmental challenges!
                            </p>
                            <p className="text-sm opacity-75 mt-2">
                                💡 Share your earned badges on social media to inspire others!
                            </p>
                            {newlyEarnedBadges.length > 0 && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm font-bold mt-2 bg-white bg-opacity-20 rounded-lg px-3 py-1 inline-block"
                                >
                                    🎉 You just earned {newlyEarnedBadges.length} new badge{newlyEarnedBadges.length > 1 ? 's' : ''}!
                                </motion.p>
                            )}
                        </div>
                        <div className="hidden md:block">
                            <div className="text-center">
                                <motion.div
                                    animate={newlyEarnedBadges.length > 0 ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ repeat: newlyEarnedBadges.length > 0 ? Infinity : 0, duration: 1 }}
                                    className="text-4xl font-bold"
                                >
                                    {Math.round((earnedCount / totalCount) * 100)}%
                                </motion.div>
                                <div className="text-sm opacity-90">Complete</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="bg-emerald-700 h-3 rounded-full relative overflow-hidden"
                            >
                                {newlyEarnedBadges.length > 0 && (
                                    <motion.div
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60"
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Category Filter */}
                <div className="bg-[#fafaff] rounded-md sticky top-[65px] z-50 shadow-lg mb-8 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center px-6 py-4 whitespace-nowrap transition-colors ${selectedCategory === category.id
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-2 text-lg">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Badges Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBadges.map((badge, index) => {
                        const earned = isEarned(badge.id)
                        const newlyEarned = isNewlyEarned(badge.id)
                        const canEarnBadge = canEarn(badge)
                        const earnedDate = getEarnedDate(badge.id)

                        return (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: earned ? 1.05 : 1.02 }}
                                className={`relative bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all ${earned
                                    ? `${getRarityBorder(badge.rarity)} shadow-lg`
                                    : 'border-gray-200 hover:border-gray-300'
                                    } ${newlyEarned ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''}`}
                            >
                                {/* Rarity Indicator */}
                                <div className={`h-2 bg-gradient-to-r ${getRarityColor(badge.rarity)} relative overflow-hidden`}>
                                    {newlyEarned && (
                                        <motion.div
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
                                        />
                                    )}
                                </div>

                                <div className="p-6">
                                    {/* Badge Icon */}
                                    <div className="text-center mb-4 relative">
                                        <motion.div
                                            animate={newlyEarned ? {
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 10, -10, 0]
                                            } : {}}
                                            transition={newlyEarned ? {
                                                repeat: Infinity,
                                                duration: 2
                                            } : {}}
                                            className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl relative ${earned
                                                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300'
                                                : 'bg-gray-100 border-2 border-gray-300 grayscale'
                                                }`}
                                        >
                                            {earned ? badge.icon : <Lock className="text-gray-400" size={32} />}

                                            {newlyEarned && (
                                                <motion.div
                                                    animate={{
                                                        scale: [0, 1.5, 0],
                                                        rotate: [0, 180, 360]
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 2,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="absolute inset-0 border-4 border-yellow-400 rounded-full"
                                                />
                                            )}
                                        </motion.div>

                                        {earned && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="absolute top-4 right-4 bg-green-800 text-white rounded-full p-2"
                                            >
                                                <Award size={16} />
                                            </motion.div>
                                        )}

                                        {/* Share Button for Earned Badges */}
                                        {earned && (
                                            <motion.button
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.7 }}
                                                onClick={() => openShareModal(badge)}
                                                className="absolute top-4 left-4 bg-green-800 hover:bg-green-700 text-white rounded-full p-2 transition-colors"
                                                title="Share this badge"
                                            >
                                                <Share2 size={16} />
                                            </motion.button>
                                        )}

                                        {/* NEW Badge Indicator */}
                                        {newlyEarned && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -12 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                                            >
                                                NEW!
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Badge Info */}
                                    <div className="text-center">
                                        <h3 className={`text-lg font-bold mb-2 ${earned ? 'text-gray-800' : 'text-gray-500'}`}>
                                            {badge.name}
                                            {newlyEarned && (
                                                <motion.span
                                                    animate={{ opacity: [0, 1, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    className="ml-2 text-yellow-500"
                                                >
                                                    ✨
                                                </motion.span>
                                            )}
                                        </h3>
                                        <p className={`text-sm mb-3 ${earned ? 'text-gray-600' : 'text-gray-400'}`}>
                                            {badge.description}
                                        </p>

                                        {/* Rarity */}
                                        <div className="mb-3">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                                                badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                                                    badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                                            </span>
                                        </div>

                                        {/* Requirement */}
                                        <div className="text-xs text-gray-500 mb-3">
                                            <div className="flex items-center justify-center">
                                                <Zap size={12} className="mr-1" />
                                                {badge.points_required} points required
                                            </div>
                                            <div className="mt-1">{badge.requirement}</div>
                                        </div>

                                        {/* Status */}
                                        {earned ? (
                                            <div className="space-y-2 flex flex-col gap-2">
                                                <motion.div
                                                    initial={newlyEarned ? { scale: 0 } : false}
                                                    animate={newlyEarned ? { scale: 1 } : false}
                                                    className={`text-green-800 px-3 py-2 rounded-lg text-sm font-medium ${newlyEarned
                                                        ? 'bg-gradient-to-r from-green-100 to-yellow-100 border border-green-300'
                                                        : 'bg-green-100'
                                                        }`}
                                                >
                                                    ✅ Earned on {earnedDate}
                                                    {newlyEarned && (
                                                        <motion.span
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ repeat: Infinity, duration: 1 }}
                                                            className="ml-2"
                                                        >
                                                            🎉
                                                        </motion.span>
                                                    )}
                                                </motion.div>
                                                <button
                                                    onClick={() => openShareModal(badge)}
                                                    className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${newlyEarned
                                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                                                        : 'bg-emerald-700 hover:bg-emerald-600 cursor-pointer text-white'
                                                        }`}
                                                >
                                                    <Share2 size={14} className="mr-2" />
                                                    {newlyEarned ? 'Share New Badge!' : 'Share Badge'}
                                                </button>
                                            </div>
                                        ) : canEarnBadge ? (
                                            <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium">
                                                🎯 Ready to earn!
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium">
                                                🔒 {badge.points_required - (student?.eco_points || 0)} more points needed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {filteredBadges.length === 0 && (
                    <div className="text-center py-12">
                        <Award size={64} className="mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No badges in this category</h3>
                        <p className="text-gray-500">Try selecting a different category to see more badges.</p>
                    </div>
                )}
            </div>

            {/* Share Modal */}
            {shareModalOpen && selectedBadge && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={closeShareModal}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">{selectedBadge.icon}</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedBadge.name}</h3>
                            <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
                            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3">
                                <p className="text-sm text-gray-700">
                                    🎉 Share your achievement and inspire others to join the environmental movement!
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Share on Social Media</h4>

                            {/* Social Media Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => shareOnTwitter(selectedBadge)}
                                    className="flex items-center justify-center p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <Twitter size={20} className="mr-2" />
                                    Twitter
                                </button>

                                <button
                                    onClick={() => shareOnLinkedIn(selectedBadge)}
                                    className="flex items-center justify-center p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                                >
                                    <Linkedin size={20} className="mr-2" />
                                    LinkedIn
                                </button>

                                <button
                                    onClick={() => shareOnFacebook(selectedBadge)}
                                    className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <Facebook size={20} className="mr-2" />
                                    Facebook
                                </button>

                                <button
                                    onClick={() => shareOnWhatsApp(selectedBadge)}
                                    className="flex items-center justify-center p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                >
                                    <MessageCircle size={20} className="mr-2" />
                                    WhatsApp
                                </button>

                                <button
                                    onClick={() => shareOnInstagram(selectedBadge)}
                                    className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors"
                                >
                                    <Instagram size={20} className="mr-2" />
                                    Instagram
                                </button>

                                <button
                                    onClick={() => copyShareLink(selectedBadge)}
                                    className="flex items-center justify-center p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    {copiedLink ? <Check size={20} className="mr-2" /> : <Copy size={20} className="mr-2" />}
                                    {copiedLink ? 'Copied!' : 'Copy Text'}
                                </button>
                            </div>

                            {/* Preview Text */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h5 className="text-sm font-bold text-gray-700 mb-2">Preview:</h5>
                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                    {generateShareText(selectedBadge)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={closeShareModal}
                            className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}

export default BadgesPage
