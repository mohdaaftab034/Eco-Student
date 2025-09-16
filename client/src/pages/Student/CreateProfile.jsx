import React, { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    School,
    GraduationCap,
    Camera,
    Target,
    Heart,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Star,
    Sparkles,
    Globe,
    Leaf,
    Save
} from 'lucide-react'
import toast from 'react-hot-toast'
import { userDataContext } from '../../Context/UserContext'

const CreateStudentProfile = ({ onProfileCreated, onCancel }) => {
    const { user, axios, token } = useContext(userDataContext);
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        school: '',
        avatar: '',
        bio: '',
        favorite_subject: '',
        environmental_goal: ''
    })

    // Available avatar options
    const avatarOptions = [
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    ]

    // Environmental subjects
    const environmentalSubjects = [
        { value: 'climate_change', label: 'Climate Change', icon: '🌡️' },
        { value: 'wildlife', label: 'Wildlife Conservation', icon: '🦋' },
        { value: 'recycling', label: 'Recycling & Waste', icon: '♻️' },
        { value: 'energy', label: 'Renewable Energy', icon: '⚡' },
        { value: 'water', label: 'Water Conservation', icon: '💧' },
        { value: 'pollution', label: 'Pollution Prevention', icon: '🌿' },
        { value: 'forests', label: 'Forest Protection', icon: '🌲' },
        { value: 'oceans', label: 'Ocean Conservation', icon: '🌊' }
    ]

    // Grade options
    const gradeOptions = [
        '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
        '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
        '11th Grade', '12th Grade'
    ]

    // Set default avatar if none selected
    useEffect(() => {
        if (!formData.avatar) {
            setFormData(prev => ({ ...prev, avatar: avatarOptions[0] }))
        }
    }, [])

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const validateStep = step => {
        switch (step) {
            case 1:
                return formData.name.trim().length >= 2
            case 2:
                return formData.grade.trim().length > 0 && formData.school.trim().length >= 2
            case 3:
                return formData.avatar.length > 0
            case 4:
                return true // Optional fields
            default:
                return true
        }
    }

    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        if (!user?._id) {
            toast.error('User not authenticated')
            return
        }

        setIsSubmitting(true)
        try {
            // Create student profile
            const studentData = {
                name: formData.name.trim(),
                grade: formData.grade,
                school: formData.school.trim(),
                avatar: formData.avatar,
                bio: formData.bio.trim(),
                favorite_subject: formData.favorite_subject,
                environmental_goal: formData.environmental_goal.trim(),
                user_id: user._id || studend._id,
                eco_points: 100, // Welcome bonus
                level: 1,
                badges: [
                    {
                        badge_id: 'welcome',
                        name: 'Welcome to EcoLearn!',
                        icon: '🌱',
                        earned_at: new Date().toISOString()
                    }
                ],
                completed_lessons: [],
                quiz_scores: [],
                join_date: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }


            const res = await axios.put(`/api/students/${user._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(studentData)
            })

            const data = await res.json();

            // Show success message
            toast.success('🎉 Welcome to EcoLearn! Your profile has been created!', {
                duration: 5000,
                style: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '16px'
                }
            })

            onProfileCreated(data.item);
        } catch (error) {
            console.error('Failed to create student profile:', error)
            toast.error('Failed to create profile. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="text-white" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your name?</h2>
                            <p className="text-gray-600">Let's start by getting to know you!</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateFormData('name', e.target.value)}
                                    className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors"
                                    placeholder="Enter your full name"
                                    autoFocus
                                />
                            </div>

                            {formData.name.length >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center p-4 bg-green-50 rounded-xl"
                                >
                                    <p className="text-green-700">
                                        Nice to meet you, <strong>{formData.name}</strong>! 🌟
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <School className="text-white" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">School Information</h2>
                            <p className="text-gray-600">Tell us about your school and grade!</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Grade *
                                </label>
                                <select
                                    value={formData.grade}
                                    onChange={(e) => updateFormData('grade', e.target.value)}
                                    className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                                >
                                    <option value="">Select your grade</option>
                                    {gradeOptions.map((grade) => (
                                        <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    School Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.school}
                                    onChange={(e) => updateFormData('school', e.target.value)}
                                    className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                                    placeholder="Enter your school name"
                                />
                            </div>
                        </div>
                    </motion.div>
                )

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Camera className="text-white" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Avatar</h2>
                            <p className="text-gray-600">Pick an avatar that represents you!</p>
                        </div>

                        <div className="text-center mb-6">
                            <img
                                src={formData.avatar}
                                alt="Selected avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 mx-auto shadow-lg"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {avatarOptions.map((avatar, index) => (
                                <button
                                    key={index}
                                    onClick={() => updateFormData('avatar', avatar)}
                                    className={`relative w-20 h-20 rounded-full overflow-hidden border-4 transition-all hover:scale-105 ${formData.avatar === avatar
                                        ? 'border-orange-500 ring-4 ring-orange-200'
                                        : 'border-gray-200 hover:border-orange-300'
                                        }`}
                                >
                                    <img
                                        src={avatar}
                                        alt={`Avatar option ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {formData.avatar === avatar && (
                                        <div className="absolute inset-0 bg-orange-500 bg-opacity-20 flex items-center justify-center">
                                            <CheckCircle className="text-orange-600" size={20} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Leaf className="text-white" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Environmental Interests</h2>
                            <p className="text-gray-600">Tell us about your environmental passions! (Optional)</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Favorite Environmental Subject
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {environmentalSubjects.map((subject) => (
                                        <button
                                            key={subject.value}
                                            onClick={() => updateFormData('favorite_subject', subject.value)}
                                            className={`p-4 text-left border-2 rounded-xl transition-all hover:scale-105 ${formData.favorite_subject === subject.value
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">{subject.icon}</div>
                                            <div className="font-semibold text-gray-800 text-sm">{subject.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Environmental Goal
                                </label>
                                <textarea
                                    value={formData.environmental_goal}
                                    onChange={(e) => updateFormData('environmental_goal', e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors"
                                    rows={3}
                                    placeholder="What environmental impact do you want to make? (e.g., Reduce plastic waste, Save water, Plant trees...)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tell us about yourself
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => updateFormData('bio', e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors"
                                    rows={3}
                                    placeholder="Share something interesting about yourself and your interests..."
                                />
                            </div>
                        </div>
                    </motion.div>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
                        <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / 4) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / 4) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={currentStep === 1 ? onCancel : prevStep}
                            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            {currentStep === 1 ? 'Cancel' : 'Previous'}
                        </button>

                        {currentStep < 4 ? (
                            <button
                                onClick={nextStep}
                                disabled={!validateStep(currentStep)}
                                className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ArrowRight size={20} className="ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Creating Profile...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} className="mr-2" />
                                        Create Profile
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Welcome Message */}
                {currentStep === 4 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 text-center"
                    >
                        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6">
                            <div className="text-4xl mb-2">🌟</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Almost Ready!</h3>
                            <p className="text-gray-600">
                                You'll start with <strong>100 eco points</strong> and your first badge!
                                Complete lessons and quizzes to earn more points and unlock achievements.
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default CreateStudentProfile
