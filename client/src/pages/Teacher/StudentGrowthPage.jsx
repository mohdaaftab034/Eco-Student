import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Award, BookOpen, Target, Download, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { userDataContext } from '../../Context/UserContext'

const StudentGrowthPage = ({ onBack }) => {
    const { user, axios } = useContext(userDataContext)
    const [students, setStudents] = useState([])
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterGrade, setFilterGrade] = useState('')
    const [filterSchool, setFilterSchool] = useState('')
    const [sortBy, setSortBy] = useState('eco_points')

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        setLoading(true); // ensure loading shows while fetching
        try {
            const res = await axios.get('/api/students');
            // Make sure res.data is an array
            if (Array.isArray(res.data)) {
                setStudents(res.data);
            } else {
                setStudents([]);
                console.warn('API returned non-array data:', res.data);
            }
            
        } catch (error) {
            console.error('Failed to fetch students:', error);
            toast.error('Failed to load student data');
            setStudents([]); // fallback empty array
        } finally {
            setLoading(false);
        }
    };


    const getStudentLevel = (ecoPoints) => {
        if (ecoPoints >= 1000) return 'Eco Master'
        if (ecoPoints >= 500) return 'Green Guardian'
        if (ecoPoints >= 250) return 'Nature Protector'
        if (ecoPoints >= 100) return 'Eco Explorer'
        return 'Green Beginner'
    }

    const getProgressPercentage = (ecoPoints) => {
        const levels = [0, 100, 250, 500, 1000]
        const currentLevel = levels.findIndex(level => ecoPoints < level) - 1
        if (currentLevel === -1) return 100

        const currentLevelPoints = levels[currentLevel]
        const nextLevelPoints = levels[currentLevel + 1]
        const progress = ((ecoPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
        return Math.min(progress, 100)
    }

    const getAverageQuizScore = (student) => {
        if (!student.quiz_scores || student.quiz_scores.length === 0) return 0
        const total = student.quiz_scores.reduce((sum, score) => sum + score.score, 0)
        return Math.round(total / student.quiz_scores.length)
    }

    const getRecentActivity = (student) => {
        const activities = []

        if (student.quiz_scores) {
            student.quiz_scores.forEach(quiz => {
                activities.push({
                    type: 'quiz',
                    date: quiz.completed_at,
                    description: `Completed quiz with ${quiz.score}% score`,
                    points: Math.round(quiz.score * 0.5)
                })
            })
        }

        if (student.completed_lessons) {
            student.completed_lessons.forEach((lessonId, index) => {
                const mockDate = new Date()
                mockDate.setDate(mockDate.getDate() - (index * 2))
                activities.push({
                    type: 'lesson',
                    date: mockDate.toISOString(),
                    description: `Completed environmental lesson`,
                    points: 50
                })
            })
        }

        return activities
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
    }

    const filteredStudents = students
        .filter(student => {
            const matchesSearch =
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.school.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesGrade = !filterGrade || student.grade === filterGrade
            const matchesSchool = !filterSchool || student.school === filterSchool
            return matchesSearch && matchesGrade && matchesSchool
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'eco_points':
                    return b.eco_points - a.eco_points
                case 'level':
                    return b.level - a.level
                case 'quiz_average':
                    return getAverageQuizScore(b) - getAverageQuizScore(a)
                default:
                    return 0
            }
        })

    const exportStudentData = () => {
        const csvContent = [
            ['Name', 'Grade', 'School', 'Eco Points', 'Level', 'Completed Lessons', 'Average Quiz Score', 'Badges Earned'],
            ...filteredStudents.map(student => [
                student.name,
                student.grade,
                student.school,
                student.eco_points,
                getStudentLevel(student.eco_points),
                student.completed_lessons?.length || 0,
                getAverageQuizScore(student) + '%',
                student.badges_earned?.length || 0
            ])
        ]
            .map(row => row.join(','))
            .join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'student_progress_report.csv'
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Report exported successfully!')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafaff] flex items-center justify-center">
                <div className="text-center flex justify-center items-center gap-5 flex-col">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mb-4"></div>
                    <p className="text-lg text-black">Loading student data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafaff] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center">
                        <button
                            onClick={onBack}
                            className="mr-4 p-2 rounded-md bg-[#fafaff] shadow-lg hover:shadow-md transition-shadow"
                        >
                            <ArrowLeft size={20} className="text-black" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 font-fredoka">Student Growth Analytics</h1>
                            <p className="text-black font-light">Track individual student progress and performance</p>
                        </div>
                    </div>

                    <button
                        onClick={exportStudentData}
                        className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors"
                    >
                        <Download size={20} className="mr-2" />
                        Export Report
                    </button>
                </motion.div>

                {!selectedStudent ? (
                    <>
                        {/* Overview Stats */}
                        <div className="grid md:grid-cols-4 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#fafaff] rounded-md shadow-lg p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-black">Total Students</p>
                                        <p className="text-3xl font-bold text-green-800">{students.length}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-md">
                                        <TrendingUp className="text-green-800" size={24} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#fafaff] rounded-md shadow-lg p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-black">Avg Eco Points</p>
                                        <p className="text-3xl font-bold text-green-800">
                                            {Math.round(students.reduce((sum, s) => sum + s.eco_points, 0) / students.length) || 0}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-md">
                                        <Award className="text-green-800" size={24} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#fafaff] rounded-md shadow-lg p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-black">Avg Lessons</p>
                                        <p className="text-3xl font-bold text-green-800">
                                            {Math.round(students.reduce((sum, s) => sum + (s.completed_lessons?.length || 0), 0) / students.length) || 0}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-md">
                                        <BookOpen className="text-green-800" size={24} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-[#fafaff] rounded-md shadow-lg p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-black">Avg Quiz Score</p>
                                        <p className="text-3xl font-bold text-green-800">
                                            {Math.round(students.reduce((sum, s) => sum + getAverageQuizScore(s), 0) / students.length) || 0}%
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-md">
                                        <Target className="text-green-800" size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Filters and Search */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-[#fafaff] rounded-md shadow-lg p-6 mb-6"
                        >
                            <div className="grid md:grid-cols-5 gap-4">
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search students..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <select
                                        value={filterGrade}
                                        onChange={(e) => setFilterGrade(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Grades</option>
                                        <option value="Grade 1">Grade 1</option>
                                        <option value="Grade 2">Grade 2</option>
                                        <option value="Grade 3">Grade 3</option>
                                        <option value="Grade 4">Grade 4</option>
                                        <option value="Grade 5">Grade 5</option>
                                    </select>
                                </div>

                                <div>
                                    <select
                                        value={filterSchool}
                                        onChange={(e) => setFilterSchool(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Schools</option>
                                        {Array.from(new Set(students.map(s => s.school))).map(school => (
                                            <option key={school} value={school}>{school}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="eco_points">Sort by Eco Points</option>
                                        <option value="name">Sort by Name</option>
                                        <option value="level">Sort by Level</option>
                                        <option value="quiz_average">Sort by Quiz Average</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>

                        {/* Students Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-[#fafaff] rounded-md shadow-lg overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eco Points</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Avg</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[#fafaff] divide-y divide-gray-200">
                                        {filteredStudents.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                        <div className="text-sm text-gray-500">{student.grade}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.school}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {getStudentLevel(student.eco_points)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {student.eco_points} points
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                                                            style={{ width: `${getProgressPercentage(student.eco_points)}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {Math.round(getProgressPercentage(student.eco_points))}%
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.completed_lessons?.length || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {getAverageQuizScore(student)}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => setSelectedStudent(student)}
                                                        className="text-green-600 hover:text-green-900 cursor-pointer text-sm font-medium"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </>
                ) : (
                    /* Individual Student Details */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 flex flex-col gap-4"
                    >
                        {/* Student Header */}
                        <div className="bg-[#fafaff] rounded-md shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-[#fafaff] shadow-lg p-4 rounded-full mr-4">
                                        <span className="text-white text-2xl">👤</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedStudent.name}</h2>
                                        <p className="text-black">{selectedStudent.grade} • {selectedStudent.school}</p>
                                        <p className="text-sm text-gray-500">
                                            Level: {getStudentLevel(selectedStudent.eco_points)} • {selectedStudent.eco_points} Eco Points
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-black transition-colors"
                                >
                                    Back to List
                                </button>
                            </div>
                        </div>

                        {/* Progress Overview */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-[#fafaff] rounded-md shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Learning Progress</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Current Level</span>
                                            <span className="text-sm text-gray-500">{getStudentLevel(selectedStudent.eco_points)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-emerald-700 h-3 rounded-full"
                                                style={{ width: `${getProgressPercentage(selectedStudent.eco_points)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">{selectedStudent.eco_points}</p>
                                            <p className="text-sm text-black">Eco Points</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">{selectedStudent.completed_lessons?.length || 0}</p>
                                            <p className="text-sm text-black">Lessons</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#fafaff] rounded-md shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Quiz Performance</h3>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-600 mb-2">
                                        {getAverageQuizScore(selectedStudent)}%
                                    </div>
                                    <p className="text-black mb-4">Average Score</p>
                                    <div className="text-sm text-gray-500">
                                        {selectedStudent.quiz_scores?.length || 0} quizzes completed
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#fafaff] rounded-md shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Achievements</h3>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-600 mb-2">
                                        {selectedStudent.badges_earned?.length || 0}
                                    </div>
                                    <p className="text-black mb-4">Badges Earned</p>
                                    <div className="flex justify-center space-x-1">
                                        {Array.from({ length: Math.min(selectedStudent.badges_earned?.length || 0, 5) }).map((_, i) => (
                                            <span key={i} className="text-lg">🏆</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#fafaff] rounded-md shadow-lg p-6">
                            <h3 className="text-lg font-bold text-black mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                {getRecentActivity(selectedStudent).map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-full mr-3 ${activity.type === 'quiz' ? 'bg-purple-100' : 'bg-green-100'
                                                }`}>
                                                {activity.type === 'quiz' ? (
                                                    <Target size={16} className="text-purple-600" />
                                                ) : (
                                                    <BookOpen size={16} className="text-green-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(activity.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-green-600">
                                            +{activity.points} points
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default StudentGrowthPage
