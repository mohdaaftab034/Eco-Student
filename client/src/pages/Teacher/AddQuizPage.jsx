import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, X, ArrowLeft, Clock, Award, Users } from 'lucide-react'
// import { useAuth } from '../../hooks/useAuth'
// import { lumi } from '../../lib/lumi'
import toast from 'react-hot-toast'
import { createQuiz } from '../../utils/api'
import { useContext } from 'react'
import { userDataContext } from '../../Context/UserContext'

const AddQuizPage = ({ onBack }) => {
    const { user } = useContext(userDataContext);
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: '',
        time_limit: 10,
        passing_score: 70,
        eco_points_reward: 50
    })
    const [questions, setQuestions] = useState([])
    const [isCreating, setIsCreating] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now().toString(),
            question: '',
            options: ['', '', '', ''],
            correct_answer: 0,
            explanation: '',
            points: 10,
            type: 'multiple_choice'
        }
        setQuestions([...questions, newQuestion])
    }

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ))
    }

    const updateQuestionOption = (id, optionIndex, value) => {
        setQuestions(questions.map(q =>
            q.id === id
                ? {
                    ...q,
                    options: q.options.map((opt, idx) =>
                        idx === optionIndex ? value : opt
                    )
                }
                : q
        ))
    }

    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

    const saveQuiz = async () => {
        if (!quizData.title || !quizData.description || questions.length === 0) {
            toast.error('Please fill in all required fields and add at least one question')
            return
        }

        setIsCreating(true)
        try {
            const quiz = {
                ...quizData,
                questions: questions.map(({ id, ...q }) => q),
                teacher_id: user._id || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            await createQuiz(quiz)
            toast.success('✅ Quiz created successfully!')
            onBack()
        } catch (error) {
            console.error('Failed to create quiz:', error)
            toast.error('Failed to create quiz')
        } finally {
            setIsCreating(false)
        }
    }

    const fetchData = async () => {
        try {
            const quizzesRes = await getQuizzes()
            setQuizzes(quizzesRes || [])
        } catch (error) {
            console.error("Failed to fetch quizzes:", error)
            toast.error("Failed to load quizzes")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteQuiz = async (quizId) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return
        try {
            await deleteQuiz(quizId)
            setQuizzes(quizzes.filter(q => q._id !== quizId))
            toast.success("Quiz deleted successfully")
        } catch (error) {
            toast.error("Failed to delete quiz")
        }
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-800'
            case 'intermediate': return 'bg-yellow-100 text-yellow-800'
            case 'advanced': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getCategoryEmoji = (category) => {
        switch (category) {
            case 'climate_change': return '🌍'
            case 'wildlife': return '🦋'
            case 'recycling': return '♻️'
            case 'energy': return '⚡'
            case 'water': return '💧'
            case 'pollution': return '🏭'
            default: return '🌱'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center">
                        <button
                            onClick={onBack}
                            className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 font-fredoka">Create New Quiz</h1>
                            <p className="text-gray-600">Design engaging quizzes for your students</p>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            {showPreview ? 'Edit' : 'Preview'}
                        </button>
                        <button
                            onClick={saveQuiz}
                            disabled={isCreating}
                            className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors disabled:opacity-50"
                        >
                            <Save size={20} className="mr-2" />
                            {isCreating ? 'Creating...' : 'Save Quiz'}
                        </button>
                    </div>
                </motion.div>

                {!showPreview ? (
                    <div className="space-y-8">
                        {/* Quiz Basic Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <Award size={20} className="text-blue-600" />
                                </div>
                                Quiz Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
                                    <input
                                        type="text"
                                        value={quizData.title}
                                        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter quiz title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select
                                        value={quizData.category}
                                        onChange={(e) => setQuizData({ ...quizData, category: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select category</option>
                                        <option value="climate_change">🌍 Climate Change</option>
                                        <option value="wildlife">🦋 Wildlife</option>
                                        <option value="recycling">♻️ Recycling</option>
                                        <option value="energy">⚡ Energy</option>
                                        <option value="water">💧 Water</option>
                                        <option value="pollution">🏭 Pollution</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                    <textarea
                                        value={quizData.description}
                                        onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe what this quiz covers"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                    <select
                                        value={quizData.difficulty}
                                        onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select difficulty</option>
                                        <option value="beginner">🟢 Beginner</option>
                                        <option value="intermediate">🟡 Intermediate</option>
                                        <option value="advanced">🔴 Advanced</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                                    <input
                                        type="number"
                                        value={quizData.time_limit}
                                        onChange={(e) => setQuizData({ ...quizData, time_limit: Number(e.target.value) })}
                                        min="1"
                                        max="60"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                                    <input
                                        type="number"
                                        value={quizData.passing_score}
                                        onChange={(e) => setQuizData({ ...quizData, passing_score: Number(e.target.value) })}
                                        min="1"
                                        max="100"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Eco Points Reward</label>
                                    <input
                                        type="number"
                                        value={quizData.eco_points_reward}
                                        onChange={(e) => setQuizData({ ...quizData, eco_points_reward: Number(e.target.value) })}
                                        min="1"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Questions Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                        <Users size={20} className="text-purple-600" />
                                    </div>
                                    Questions ({questions.length})
                                </h2>

                                <button
                                    onClick={addQuestion}
                                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors"
                                >
                                    <Plus size={20} className="mr-2" />
                                    Add Question
                                </button>
                            </div>

                            {questions.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📝</div>
                                    <p className="text-gray-500 text-lg">No questions added yet</p>
                                    <p className="text-gray-400">Click "Add Question" to get started</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {questions.map((question, index) => (
                                        <motion.div
                                            key={question.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="border border-gray-200 rounded-lg p-6"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-gray-800">Question {index + 1}</h3>
                                                <button
                                                    onClick={() => removeQuestion(question.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                                                    <textarea
                                                        value={question.question}
                                                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                                                        rows={2}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter your question"
                                                    />
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {question.options.map((option, optionIndex) => (
                                                        <div key={optionIndex}>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Option {optionIndex + 1} {question.correct_answer === optionIndex && '✓ Correct'}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${question.correct_answer === optionIndex
                                                                    ? 'border-green-300 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                                placeholder={`Enter option ${optionIndex + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                                                        <select
                                                            value={question.correct_answer}
                                                            onChange={(e) => updateQuestion(question.id, 'correct_answer', Number(e.target.value))}
                                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value={0}>Option 1</option>
                                                            <option value={1}>Option 2</option>
                                                            <option value={2}>Option 3</option>
                                                            <option value={3}>Option 4</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                                                        <input
                                                            type="number"
                                                            value={question.points}
                                                            onChange={(e) => updateQuestion(question.id, 'points', Number(e.target.value))}
                                                            min="1"
                                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                                                    <textarea
                                                        value={question.explanation}
                                                        onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                                                        rows={2}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Explain why this is the correct answer"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                ) : (
                    /* Quiz Preview */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <div className="text-center mb-8">
                            <div className="text-4xl mb-4">{getCategoryEmoji(quizData.category)}</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{quizData.title || 'Quiz Title'}</h2>
                            <p className="text-gray-600 mb-4">{quizData.description || 'Quiz description'}</p>

                            <div className="flex items-center justify-center space-x-6 text-sm">
                                {quizData.difficulty && (
                                    <span className={`px-3 py-1 rounded-full ${getDifficultyColor(quizData.difficulty)}`}>
                                        {quizData.difficulty}
                                    </span>
                                )}
                                <span className="flex items-center text-gray-600">
                                    <Clock size={16} className="mr-1" />
                                    {quizData.time_limit} min
                                </span>
                                <span className="flex items-center text-gray-600">
                                    <Award size={16} className="mr-1" />
                                    {quizData.eco_points_reward} points
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {questions.map((question, index) => (
                                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                                        {index + 1}. {question.question || 'Question text'}
                                    </h3>

                                    <div className="space-y-3">
                                        {question.options.map((option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className={`p-3 border rounded-lg ${question.correct_answer === optionIndex
                                                    ? 'border-green-300 bg-green-50'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <span className="font-medium mr-2">
                                                    {String.fromCharCode(65 + optionIndex)}.
                                                </span>
                                                {option || `Option ${optionIndex + 1}`}
                                                {question.correct_answer === optionIndex && (
                                                    <span className="ml-2 text-green-600 font-bold">✓</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {question.explanation && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>Explanation:</strong> {question.explanation}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-4 text-right">
                                        <span className="text-sm text-gray-500">Points: {question.points}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {questions.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <p className="text-gray-500">No questions to preview</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default AddQuizPage
