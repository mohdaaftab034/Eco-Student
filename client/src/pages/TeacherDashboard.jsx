
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Users, BarChart3, Settings, LogOut, Edit, Trash2, Eye, User, PlusCircle } from 'lucide-react'
// import { useAuth } from '../hooks/useAuth'
// import { realtimeEvents } from '../hooks/useRealtimeUpdates'
// import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'
import { useContext } from 'react'
import { userDataContext } from '../Context/UserContext'
import { realtimeEvents } from '../hooks/useRealtimeUpdates'
import AddQuizPage from './Teacher/AddQuizPage'
import AddLessonsPage from './Teacher/AddLessonsPage'
import StudentGrowthPage from './Teacher/StudentGrowthPage'
import TeacherProfile from './Teacher/TeacherProfile'
import Footer from '../components/Footer'

const Lesson = {
  _id: "",
  title: "",
  content: "",
  description: "",
  difficulty: "",
  category: "",
  eco_points_reward: 0,
  estimated_duration: 0,
  media_url: "",
  teacher_id: "",
  createdAt: ""
}

export const Quiz = {
  _id: '',
  title: '',
  description: '',
  category: '',
  difficulty: '',
  questions: [
    {
      question: '',
      options: [''],
      correct_answer: 0,
      explanation: '',
      points: 0
    }
  ],
  time_limit: 0,
  passing_score: 0,
  eco_points_reward: 0,
  teacher_id: '',
  createdAt: ''
}

const Student = {
  _id: "",
  name: "",
  grade: "",
  school: "",
  eco_points: 0,
  level: 0,
  completed_lessons: [''],
  quiz_scores: [
    {
      quiz_id: "",
      score: 0,
      completed_at: ""
    }
  ]
}


const TeacherDashboard = () => {
  const { user, userSignOut, axios } = useContext(userDataContext);
  const [activeTab, setActiveTab] = useState('dashboard')
  const [lessons, setLessons] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchData();
      fetchStudents();
    }
  }, [activeTab])

  // Listen for lesson creation events
  useEffect(() => {
    const handleLessonCreated = () => {
      fetchData()
      realtimeEvents.emit('refresh-student-data')
      toast.success('🎉 Lesson created! Students will see it immediately on their dashboards.', {
        duration: 4000
      })
    }

    const unsubscribe = realtimeEvents.subscribe('lesson-created', handleLessonCreated)
    return unsubscribe
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


  const fetchData = async () => {
    try {
      const [lessonsRes, quizzesRes, studentsRes] = await Promise.all([
        axios.get('/api/lessons'),
        axios.get('/api/quizzes?sort=-createdAt&limit=6'),
        
      ])

      setLessons(lessonsRes.data.lessons || [])
      setQuizzes(quizzesRes.data || [])
    
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }


  const deleteLesson = async (lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    try {
      await axios.delete(`/api/lessons/${lessonId}`)
      setLessons(lessons.filter(p => p._id !== lessonId))

      realtimeEvents.emit('refresh-student-data')
      toast.success('Lesson deleted successfully')
    } catch (error) {
      toast.error('Failed to delete lesson')
    }
  }

  const deleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return

    try {
      await axios.delete(`/api/quizzes/${quizId}`)
      setQuizzes(quizzes.filter(q => q._id !== quizId))

      realtimeEvents.emit('refresh-student-data')
      toast.success('Quiz deleted successfully')
    } catch (error) {
      toast.error('Failed to delete quiz')
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

  // Render different pages based on activeTab
  if (activeTab === 'add-quiz') {
    return <AddQuizPage onBack={() => setActiveTab('dashboard')} />
  }

  if (activeTab === 'add-lessons') {
    return <AddLessonsPage onBack={() => setActiveTab('dashboard')} />
  }

  if (activeTab === 'student-growth') {
    return <StudentGrowthPage onBack={() => setActiveTab('dashboard')} />
  }

  if (activeTab === 'profile') {
    return <TeacherProfile onBack={() => setActiveTab('dashboard')} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaff] flex items-center justify-center">
        <div className="text-center flex flex-col justify-center items-center gap-5">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mb-4"></div>
          <p className="text-lg text-gray-600">Loading teacher dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaff]">
      {/* Header */}
      <header className="bg-[#fafaff] sticky top-0 z-50 shadow-lg ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer">
              <div className="bg-black hidden sm:flex p-2 rounded-md shadow-lg mr-3">
                <Settings className="text-white" size={24} />
              </div>
              <h1 className="text-2xl gap-2 font-bold text-gray-800 font-fredoka">EcoLearn <span className='text-green-800'>Teacher</span></h1>
            </div>

            <div className="flex items-center gap-3 space-x-4">
              <div className="text-sm font-medium text-black">
                Welcome, {user?.name}
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                className="hidden sm:flex cursor-pointer items-center text-black hover:text-blue-600 transition-colors"
              >
                <User size={20} className="mr-1" />
                Profile
              </button>
              <button
                onClick={userSignOut}
                className="flex items-center cursor-pointer text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} className="mr-1 hidden sm:flex" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#fafaff] transition-transform duration-300 hover:scale-105 ease-in-out rounded-md p-6 mb-8 text-black shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-fredoka">
                <span className='text-green-800'>Teacher</span> Dashboard 👩‍🏫
              </h2>
              <p className="text-lg font-light opacity-90">
                Create engaging content and track student progress in environmental education
              </p>
              <p className="text-sm  opacity-75 mt-2">
                💡 Your lessons appear instantly on student dashboards!
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl animate-pulse">📚</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <button
            onClick={() => setActiveTab('add-quiz')}
            className="bg-[#fafaff] rounded-md shadow-lg p-6 text-left transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <Plus className="text-green-600" size={24} />
              </div>
              <PlusCircle className="text-green-400 group-hover:text-green-600 transition-colors" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Create Quiz</h3>
            <p className="text-gray-600 text-sm">Design interactive quizzes for students</p>
          </button>

          <button
            onClick={() => setActiveTab('add-lessons')}
            className="bg-[#fafaff] rounded-md shadow-lg p-6 text-left transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <BookOpen className="text-green-600" size={24} />
              </div>
              <PlusCircle className="text-green-400 group-hover:text-green-600 transition-colors" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Lessons</h3>
            <p className="text-gray-600 text-sm">Create and organize educational content</p>
          </button>

          <button
            onClick={() => setActiveTab('student-growth')}
            className="bg-[#fafaff] rounded-md shadow-lg p-6 text-left transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <BarChart3 className="text-green-600" size={24} />
              </div>
              <Users className="text-green-400 group-hover:text-green-600 transition-colors" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Student Analytics</h3>
            <p className="text-gray-600 text-sm">Track individual student progress</p>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="bg-[#fafaff] rounded-md shadow-lg p-6 text-left transition-transform duration-300  hover:-translate-y-2 hover:shadow-xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <User className="text-green-600" size={24} />
              </div>
              <Settings className="text-green-400 group-hover:text-green-600 transition-colors" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">My Profile</h3>
            <p className="text-gray-600 text-sm">Manage your account settings</p>
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                <motion.p
                  key={lessons.length}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-blue-600"
                >
                  {lessons.length}
                </motion.p>
              </div>
              <BookOpen className="text-blue-500" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <motion.p
                  key={quizzes.length}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-purple-600"
                >
                  {quizzes.length}
                </motion.p>
              </div>
              <Edit className="text-purple-500" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <motion.p
                  key={students.length}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-green-600"
                >
                  {students?.length}
                </motion.p>
              </div>
              <Users className="text-green-500" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                <p className="text-3xl font-bold text-orange-600">87%</p>
              </div>
              <BarChart3 className="text-orange-500" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Recent Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Lessons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Recent Lessons</h3>
              <button
                onClick={() => setActiveTab('add-lessons')}
                className="text-green-600 hover:text-green-800 cursor-pointer text-sm font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              {Array.isArray(lessons) && lessons.slice(0, 3).map((lesson) => (
                <div key={lesson._id} className="flex items-center justify-between p-4 transition-colors duration-300 hover:bg-gray-300 rounded-md">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getCategoryEmoji(lesson.category)}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{lesson.title}</h4>
                      <p className="text-sm text-gray-600">{lesson.estimated_duration} min • {lesson.eco_points_reward} points</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 cursor-pointer hover:bg-blue-100 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => deleteLesson(lesson._id)}
                      className="p-2 text-red-600 cursor-pointer hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}


              {lessons.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto text-black mb-4" size={48} />
                  <p className="text-black">No lessons created yet</p>
                  <button
                    onClick={() => setActiveTab('add-lessons')}
                    className="mt-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                  >
                    Create your first lesson
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Recent Quizzes</h3>
              <button
                onClick={() => setActiveTab('add-quiz')}
                className="text-emerald-600 hover:text-emerald-800 cursor-pointer text-sm font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              {quizzes.slice(0, 3).map((quiz) => (
                <div key={quiz._id} className="flex items-center justify-between p-4 transition-colors duration-300 hover:bg-gray-300 rounded-md">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getCategoryEmoji(quiz.category)}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{quiz.title}</h4>
                      <p className="text-sm text-gray-600">{quiz.questions.length} questions • {quiz.time_limit} min</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 cursor-pointer hover:bg-blue-100 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => deleteQuiz(quiz._id)}
                      className="p-2 text-red-600 cursor-pointer hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {quizzes.length === 0 && (
                <div className="text-center py-8">
                  <Edit className="mx-auto text-black mb-4" size={48} />
                  <p className="text-black">No quizzes created yet</p>
                  <button
                    onClick={() => setActiveTab('add-quiz')}
                    className="mt-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                  >
                    Create your first quiz
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[#fafaff] rounded-md shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Top Performing Students</h3>
            <button
              onClick={() => setActiveTab('student-growth')}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              View Analytics
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eco Points</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                </tr>
              </thead>
              <tbody className="bg-[#fafaff] divide-y divide-gray-200">
                {Array.isArray(students) && students.slice(0, 5).map((student, index) => (
                  <tr key={student._id} className="hover:bg-gray-200 rounded-md">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                          }`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.grade} • {student.school}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {student.eco_points} points
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.completed_lessons?.length || 0}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Level {student.level}
                      </span>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-black">No student data available</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default TeacherDashboard
