import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Clock,
    Trophy,
    Star,
    CheckCircle,
    XCircle,
    RotateCcw,
    Play,
    Award
} from 'lucide-react'
import toast from 'react-hot-toast'
import { userDataContext } from '../../Context/UserContext'
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates'

const QuizzesPage = ({ onBack }) => {
    const { user, axios } = useContext(userDataContext);
    const { student, updateStudentPoints, updateStudentBadges } = useRealtimeUpdates(user?._id)

    const [quizzes, setQuizzes] = useState([])
    const [selectedQuiz, setSelectedQuiz] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [timeLeft, setTimeLeft] = useState(0)
    const [quizStarted, setQuizStarted] = useState(false)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [quizResult, setQuizResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showExplanation, setShowExplanation] = useState(false)

    useEffect(() => {
        fetchQuizzes()
    }, [])

    useEffect(() => {
        let timer
        if (quizStarted && timeLeft > 0 && !quizCompleted) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
        } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
            handleQuizSubmit()
        }
        return () => clearTimeout(timer)
    }, [timeLeft, quizStarted, quizCompleted])

    const fetchQuizzes = async () => {
        try {
            const res = await axios.get("/api/content/quizzes?sort=-createdAt");
            const { list } = res.data;
            setQuizzes(list || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
        }
    };


    const startQuiz = (quiz) => {
        setSelectedQuiz(quiz)
        setCurrentQuestionIndex(0)
        setSelectedAnswers(new Array(quiz.questions.length).fill(-1))
        setTimeLeft(quiz.time_limit * 60)
        setQuizStarted(true)
        setQuizCompleted(false)
        setQuizResult(null)
        setShowExplanation(false)
    }

    const handleAnswerSelect = (answerIndex) => {
        const newAnswers = [...selectedAnswers]
        newAnswers[currentQuestionIndex] = answerIndex
        setSelectedAnswers(newAnswers)
    }

    const nextQuestion = () => {
        if (currentQuestionIndex < (selectedQuiz?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setShowExplanation(false)
        } else {
            handleQuizSubmit()
        }
    }

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
            setShowExplanation(false)
        }
    }

    const handleQuizSubmit = async () => {
        if (!selectedQuiz || !student) return

        const timeTaken = selectedQuiz.time_limit * 60 - timeLeft
        let correctAnswers = 0
        let totalPoints = 0

        const answers = selectedQuiz.questions.map((question, index) => {
            const isCorrect = selectedAnswers[index] === question.correct_answer
            if (isCorrect) {
                correctAnswers++
                totalPoints += question.points
            }
            return {
                question_index: index,
                selected_answer: selectedAnswers[index],
                is_correct: isCorrect,
                points_earned: isCorrect ? question.points : 0
            }
        })

        const scorePercentage = Math.round((correctAnswers / selectedQuiz.questions.length) * 100)
        const passed = scorePercentage >= selectedQuiz.passing_score

        const attempt = {
            quiz_id: selectedQuiz._id,
            score: scorePercentage,
            total_questions: selectedQuiz.questions.length,
            correct_answers: correctAnswers,
            time_taken: timeTaken,
            completed_at: new Date().toISOString(),
            answers
        }

        try {
            const updatedQuizScores = [
                ...(student.quiz_scores || []),
                { quiz_id: selectedQuiz._id, score: scorePercentage, completed_at: attempt.completed_at }
            ]
            await lumi.entities.students.update(student._id, { quiz_scores: updatedQuizScores })

            if (passed) {
                await updateStudentPoints(selectedQuiz.eco_points_reward, `Quiz completed with ${scorePercentage}%!`)
            }

            const newBadges = checkForNewBadges(scorePercentage, updatedQuizScores)
            if (newBadges.length > 0) {
                await updateStudentBadges(newBadges)
            }

            setQuizResult(attempt)
            setQuizCompleted(true)
            setQuizStarted(false)

            if (passed) {
                toast.success(`🎉 Quiz completed! Score: ${scorePercentage}% (+${selectedQuiz.eco_points_reward} points)`)
            } else {
                toast.error(`Quiz completed with ${scorePercentage}%. Need ${selectedQuiz.passing_score}% to pass.`)
            }
        } catch (error) {
            console.error('Failed to submit quiz:', error)
            toast.error('Failed to submit quiz')
        }
    }

    const checkForNewBadges = (score, quizScores) => {
        const currentBadgeIds = student?.badges?.map((b) => b.badge_id) || []
        const newBadges = []

        if (quizScores.length === 1 && !currentBadgeIds.includes('quiz_beginner')) {
            newBadges.push({
                badge_id: 'quiz_beginner',
                name: 'Quiz Beginner',
                icon: '🎯',
                earned_at: new Date().toISOString()
            })
        }

        if (score === 100 && !currentBadgeIds.includes('perfect_score')) {
            newBadges.push({
                badge_id: 'perfect_score',
                name: 'Perfect Score',
                icon: '💯',
                earned_at: new Date().toISOString()
            })
        }

        const highScoreQuizzes = quizScores.filter((q) => q.score >= 80)
        if (highScoreQuizzes.length >= 5 && !currentBadgeIds.includes('quiz_master')) {
            newBadges.push({
                badge_id: 'quiz_master',
                name: 'Quiz Master',
                icon: '🧠',
                earned_at: new Date().toISOString()
            })
        }

        return newBadges
    }

    const resetQuiz = () => {
        setSelectedQuiz(null)
        setCurrentQuestionIndex(0)
        setSelectedAnswers([])
        setTimeLeft(0)
        setQuizStarted(false)
        setQuizCompleted(false)
        setQuizResult(null)
        setShowExplanation(false)
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
            case 'easy':
                return 'bg-green-100 text-green-800'
            case 'intermediate':
            case 'medium':
                return 'bg-yellow-100 text-yellow-800'
            case 'advanced':
            case 'hard':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getCategoryEmoji = (category) => {
        switch (category) {
            case 'climate_change':
                return '🌍'
            case 'wildlife':
                return '🦋'
            case 'recycling':
                return '♻️'
            case 'energy':
                return '⚡'
            case 'water':
                return '💧'
            case 'pollution':
                return '🏭'
            default:
                return '🌱'
        }
    }

    const hasCompletedQuiz = (quizId) =>
        student?.quiz_scores?.some((score) => score.quiz_id === quizId) || false

    const getQuizScore = (quizId) => {
        const score = student?.quiz_scores?.find((score) => score.quiz_id === quizId)
        return score ? score.score : null
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center flex justify-center flex-col items-center gap-5">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-lg text-gray-600">Loading quizzes...</p>
                </div>
            </div>
        )
    }

    // Quiz Taking Interface
    if (quizStarted && selectedQuiz && !quizCompleted) {
        const currentQuestion = selectedQuiz.questions[currentQuestionIndex]
        const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                {/* Quiz Header */}
                <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-blue-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold text-gray-800">{selectedQuiz.title}</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center text-red-600">
                                    <Clock size={20} className="mr-2" />
                                    <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-xl shadow-sm p-8 mb-6"
                    >
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Question {currentQuestionIndex + 1}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {currentQuestion.points} points
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                {currentQuestion.question}
                            </h2>
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-3 mb-6">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${selectedAnswers[currentQuestionIndex] === index
                                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs font-bold">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        {option}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Show Explanation Button (after answering) */}
                        {selectedAnswers[currentQuestionIndex] !== -1 && (
                            <button
                                onClick={() => setShowExplanation(!showExplanation)}
                                className="mb-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                {showExplanation ? 'Hide' : 'Show'} Explanation
                            </button>
                        )}

                        {/* Explanation */}
                        {showExplanation && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
                            >
                                <h4 className="font-bold text-yellow-800 mb-2">Explanation:</h4>
                                <p className="text-yellow-700">{currentQuestion.explanation}</p>
                                <p className="text-sm text-yellow-600 mt-2">
                                    Correct answer: {String.fromCharCode(65 + currentQuestion.correct_answer)} - {currentQuestion.options[currentQuestion.correct_answer]}
                                </p>
                            </motion.div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between">
                            <button
                                onClick={previousQuestion}
                                disabled={currentQuestionIndex === 0}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <button
                                onClick={nextQuestion}
                                disabled={selectedAnswers[currentQuestionIndex] === -1}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    // Quiz Results Interface
    if (quizCompleted && quizResult && selectedQuiz) {
        const passed = quizResult.score >= selectedQuiz.passing_score

        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-green-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <h1 className="text-2xl font-bold text-gray-800">Quiz Results</h1>
                            <button
                                onClick={resetQuiz}
                                className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Quizzes
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Results Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-xl shadow-sm p-8 mb-8 border-2 ${passed ? 'border-green-300' : 'border-red-300'
                            }`}
                    >
                        <div className="text-center">
                            <div className={`text-6xl mb-4 ${passed ? '🎉' : '😔'}`}>
                                {passed ? '🎉' : '😔'}
                            </div>
                            <h2 className={`text-3xl font-bold mb-4 ${passed ? 'text-green-800' : 'text-red-800'
                                }`}>
                                {passed ? 'Congratulations!' : 'Keep Trying!'}
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                You scored {quizResult.score}% on "{selectedQuiz.title}"
                            </p>

                            {/* Score Breakdown */}
                            <div className="grid md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{quizResult.score}%</div>
                                    <div className="text-sm text-blue-800">Final Score</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{quizResult.correct_answers}</div>
                                    <div className="text-sm text-green-800">Correct Answers</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{formatTime(quizResult.time_taken)}</div>
                                    <div className="text-sm text-purple-800">Time Taken</div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {passed ? selectedQuiz.eco_points_reward : 0}
                                    </div>
                                    <div className="text-sm text-orange-800">Points Earned</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => startQuiz(selectedQuiz)}
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
                                >
                                    <RotateCcw size={20} className="mr-2" />
                                    Retake Quiz
                                </button>
                                <button
                                    onClick={resetQuiz}
                                    className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    <ArrowLeft size={20} className="mr-2" />
                                    Back to Quizzes
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Detailed Results */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Question Review</h3>
                        <div className="space-y-4">
                            {selectedQuiz.questions.map((question, index) => {
                                const answer = quizResult.answers[index]
                                const isCorrect = answer.is_correct

                                return (
                                    <div key={index} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                        }`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-gray-800">
                                                {index + 1}. {question.question}
                                            </h4>
                                            {isCorrect ? (
                                                <CheckCircle className="text-green-600" size={20} />
                                            ) : (
                                                <XCircle className="text-red-600" size={20} />
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>Your answer: {question.options[answer.selected_answer] || 'No answer'}</p>
                                            {!isCorrect && (
                                                <p className="text-green-600">
                                                    Correct answer: {question.options[question.correct_answer]}
                                                </p>
                                            )}
                                            <p className="mt-2 text-gray-700">{question.explanation}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Main Quizzes List
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-blue-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={onBack}
                                className="flex items-center text-blue-500 hover:text-blue-700 transition-colors mr-4"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Dashboard
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Environmental Quizzes</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {student && (
                                <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
                                    <span className="font-bold text-blue-800">{student.quiz_scores?.length || 0} Completed</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl p-6 mb-8 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 font-fredoka">Test Your Knowledge! 🧠</h2>
                            <p className="text-lg opacity-90">
                                Challenge yourself with environmental quizzes and earn eco points!
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-6xl animate-pulse">🧠</div>
                        </div>
                    </div>
                </motion.div>

                {/* Quizzes Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz, index) => {
                        const completed = hasCompletedQuiz(quiz._id)
                        const score = getQuizScore(quiz._id)

                        return (
                            <motion.div
                                key={quiz._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all ${completed ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-blue-200'
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl">{getCategoryEmoji(quiz.category)}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                                            {quiz.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{quiz.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{quiz.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <div className="text-sm font-medium text-gray-800">{quiz.questions.length}</div>
                                            <div className="text-xs text-gray-600">Questions</div>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <div className="text-sm font-medium text-gray-800">{quiz.time_limit} min</div>
                                            <div className="text-xs text-gray-600">Time Limit</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Star className="mr-1" size={16} />
                                            {quiz.eco_points_reward} points
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Pass: {quiz.passing_score}%
                                        </div>
                                    </div>

                                    {completed ? (
                                        <div className="space-y-2">
                                            <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium text-center">
                                                ✅ Completed - Score: {score}%
                                            </div>
                                            <button
                                                onClick={() => startQuiz(quiz)}
                                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center"
                                            >
                                                <RotateCcw size={16} className="mr-2" />
                                                Retake Quiz
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startQuiz(quiz)}
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center"
                                        >
                                            <Play size={16} className="mr-2" />
                                            Start Quiz
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {quizzes.length === 0 && (
                    <div className="text-center py-12">
                        <Brain size={64} className="mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No quizzes available</h3>
                        <p className="text-gray-500">Check back later for new environmental quizzes!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QuizzesPage
