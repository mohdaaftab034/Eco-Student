
import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Trophy, Star, Users, User, LogOut, Award, Zap, Target, Heart, Share2, RefreshCw, User2, Settings, LogOutIcon, CrossIcon, LucideCross, X, ChartAreaIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { userDataContext } from '../Context/UserContext'
import { useRealtimeEvents, useRealtimeUpdates } from '../hooks/useRealtimeUpdates'
import LessonPage from './Student/LessonPage'
import QuizzesPage from './Student/QuizzesPage'
import BadgesPage from './Student/BadgesPage'
// import StudentProfile from './Student/StudentProfile'
import NGOsPage from './Student/NgoPage'
import { useNavigate } from 'react-router-dom'
import ChatBot from './Student/ChatBot'
// import { userDataContext } from '../Context/UserContext'


export const Lesson = {
  _id: "",
  title: "",
  description: "",
  difficulty: "",
  category: "",
  eco_points_reward: 0,
  estimated_duration: 0,
  media_url: ""
}


export const Quiz = {
  _id: "",
  title: "",
  description: "",
  category: "",
  difficulty: "",
  eco_points_reward: "",
  time_limit: ""
}

export const Challenge = {
  _id: "",
  title: "",
  description: "",
  category: "",
  difficulty: "",
  eco_points_reward: "",
  duration_days: "",
  participants: [
    {
      student_id: '',
      joined_at: '',
      completed: false
    }
  ]

}
export const Campaign = {
  _id: '',
  title: '',
  description: '',
  category: '',
  start_date: '',
  end_date: '',
  location: '',
  target_participants: 0,
  current_participants: 0,
  impact_goal: '',
  participating_schools: [''],
  ngo_id: '',
  status: ''
}


const StudentDashboard = () => {
  const { user, axios, userSignOut, token } = useContext(userDataContext);
  const { student, refreshStudent, updateStudentPoints, updateStudentBadges } = useRealtimeUpdates(user?._id)
  const { lastUpdate, triggerRefresh } = useRealtimeEvents()
  const [video, setVideo] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard')
  const [lessons, setLessons] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [challenges, setChallenges] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState([])
  const [open, setOpen] = useState(false);

  // Real-time update tracking
  const [lastLessonCount, setLastLessonCount] = useState(0)
  const [lastCampaignCount, setLastCampaignCount] = useState(0)

  const navigate = useNavigate();

  // Badge system configuration
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
      badge_id: 'eco_warrior',
      name: 'Eco Warrior',
      icon: '🌟',
      points_required: 50,
      requirement: 'Earn 50 eco points',
      category: 'achievement'
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
      badge_id: 'water_saver',
      name: 'Water Saver',
      icon: '💧',
      points_required: 200,
      requirement: 'Earn 200 eco points',
      category: 'conservation'
    },
    {
      badge_id: 'tree_planter',
      name: 'Tree Planter',
      icon: '🌳',
      points_required: 300,
      requirement: 'Earn 300 eco points',
      category: 'action'
    },
    {
      badge_id: 'energy_saver',
      name: 'Energy Saver',
      icon: '⚡',
      points_required: 250,
      requirement: 'Complete energy lessons',
      category: 'energy'
    },
    {
      badge_id: 'climate_champion',
      name: 'Climate Champion',
      icon: '🌍',
      points_required: 400,
      requirement: 'Earn 400 eco points',
      category: 'learning'
    },
    {
      badge_id: 'wildlife_protector',
      name: 'Wildlife Protector',
      icon: '🦋',
      points_required: 500,
      requirement: 'Earn 500 eco points',
      category: 'action'
    },
    {
      badge_id: 'recycling_hero',
      name: 'Recycling Hero',
      icon: '♻️',
      points_required: 150,
      requirement: 'Complete recycling lessons',
      category: 'recycling'
    },
    {
      badge_id: 'green_leader',
      name: 'Green Leader',
      icon: '👑',
      points_required: 1000,
      requirement: 'Earn 1000 eco points',
      category: 'leadership'
    }
  ]

  useEffect(() => {
    if (user) {
      fetchLessons()
      fetchQuizzes()
      fetchChallenges()
      fetchCampaigns()
      fetchLeaderboard()
    }
  }, [user])

  // Listen for real-time updates
  useEffect(() => {
    if (lastUpdate) {
      if (lastUpdate.type === 'student' || lastUpdate.type === 'points' || lastUpdate.type === 'badges') {
        // Refresh leaderboard when points/badges change
        fetchLeaderboard()
      }
    }
  }, [lastUpdate])

  // Real-time polling for new content
  useEffect(() => {
    if (!user) return

    const pollInterval = setInterval(() => {
      checkForNewContent()
    }, 10000) // Check every 10 seconds

    return () => clearInterval(pollInterval)
  }, [user, lastLessonCount, lastCampaignCount])

  // Listen for badge page events from lesson completion
  useEffect(() => {
    const handleOpenBadgesPage = (event) => {
      const newBadges = event.detail?.newBadges || []
      if (newBadges.length > 0) {
        setNewlyEarnedBadges(newBadges)
      }
      setActiveTab('badges')

      // Refresh student data to get latest points and badges
      triggerRefresh()
    }

    window.addEventListener('openBadgesPage', handleOpenBadgesPage)

    return () => {
      window.removeEventListener('openBadgesPage', handleOpenBadgesPage)
    }
  }, [triggerRefresh])

  const checkForNewContent = async () => {
    try {
      const [lessonsRes, campaignsRes] = await Promise.all([
        axios.get("/api/content/lessons?limit=1"),   // backend se latest lesson
        axios.get("/api/content/campaigns?limit=1")  // backend se latest campaign
      ]);

      const currentLessonCount = lessonsRes.data.total || 0;
      const currentCampaignCount = campaignsRes.data.total || 0;

      //  New lesson check
      if (currentLessonCount > lastLessonCount && lastLessonCount > 0) {
        toast.success("🎉 New lesson available! Check it out!", {
          duration: 4000,
          onClick: () => setActiveTab("lessons"),
        });
        fetchLessons();
      }

      //  New campaign check
      if (currentCampaignCount > lastCampaignCount && lastCampaignCount > 0) {
        toast.success("🌍 New NGO campaign available! Join the impact!", {
          duration: 4000,
          onClick: () => setActiveTab("ngos"),
        });
        fetchCampaigns();
      }

      setLastLessonCount(currentLessonCount);
      setLastCampaignCount(currentCampaignCount);
    } catch (error) {
      console.error("Failed to check for new content:", error);
    }
  };


  const fetchLessons = async () => {
    try {
      const res = await axios.get("/api/content/lessons?sort=-createdAt");
      const { list, total } = res.data;

      setLessons(list || []);
      if (lastLessonCount === 0) {
        setLastLessonCount(total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    }
  };


  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("/api/content/quizzes?sort=-createdAt");
      const { list } = res.data;

      setQuizzes(list || []);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };


  const fetchChallenges = async () => {
    try {
      const res = await axios.get("/api/content/challenges?sort=-createdAt");
      const { list } = res.data;

      setChallenges(list || []);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("/api/content/campaigns?sort=-createdAt");
      const { list, total } = res.data;

      setCampaigns(list || []);

      // First time jab campaigns fetch ho rahe hain
      if (lastCampaignCount === 0) {
        setLastCampaignCount(total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get("/api/students/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });


      setLeaderboard(res.data.list || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };



  const manualRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        fetchLessons(),
        fetchCampaigns(),
        fetchQuizzes(),
        fetchChallenges(),
        refreshStudent()
      ])
      toast.success('✨ Content refreshed!')
    } catch (error) {
      toast.error('Failed to refresh content')
    } finally {
      setRefreshing(false)
    }
  }

  const completeLesson = async (lessonId, points) => {
    if (!student) return

    try {
      const updateLessons = [...(student.completed_lessons || []), lessonId];

      await axios.put(`/api/students/${student._id}/lessons`, {
        lessonId,
        completeLesson: updateLessons,
        points
      });

      const newBadges = checkForNewBadges(
        student.eco_points + points,
        updateLessons.length,
        student.badges || []
      );

      await updateStudentPoints(points, "Lesson completed")

      if (newBadges.length > 0) {
        await updateStudentBadges(newBadges);
        setNewlyEarnedBadges(newBadges);

        setTimeout(() => {
          setActiveTab("badges");

          toast.success(
            `🏆 Check out your new badge${newBadges.length > 1 ? "s" : ""} in the Badges section!`,
            { duration: 4000 }
          )
        }, 3000);
      }

      fetchLeaderboard();
    } catch (error) {
      toast.error('Failed to complete lesson')
    }
  }

  const checkForNewBadges = (points, lessonsCompleted, currentBadges) => {
    const earnedBadgeIds = currentBadges.map(badge => badge.badge_id)
    const newBadges = []

    for (const badge of availableBadges) {
      // Skip if already earned
      if (earnedBadgeIds.includes(badge.badge_id)) continue

      let shouldEarn = false

      // Check different badge requirements
      switch (badge.badge_id) {
        case 'first_lesson':
          shouldEarn = lessonsCompleted >= 1
          break
        case 'lesson_master':
          shouldEarn = lessonsCompleted >= 5
          break
        default:
          // Points-based badges
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


  const joinChallenge = async (challengeId) => {
    if (!student) return;

    try {
      const challenge = challenges.find(c => c._id === challengeId);
      if (!challenge) return;

      const isAlreadyJoined = challenge.participants.some(
        p => p.student_id === student._id
      );
      if (isAlreadyJoined) {
        toast.error('You have already joined this challenge!');
        return;
      }

      const newParticipant = {
        student_id: student._id,
        joined_at: new Date().toISOString(),
        completed: false
      };

      // Backend API call (axios)
      const res = await axios.post(
        `/api/challenges/${challengeId}/join`,
        newParticipant,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!res.data.success) {
        return toast.error(res.data.message || "Something went wrong");
      }

      const updatedChallenge = res.data.challenge; // backend se challenge return karao

      // Update local state with backend response
      setChallenges(challenges.map(c =>
        c._id === challengeId ? updatedChallenge : c
      ));

      toast.success('🌟 Challenge joined! Good luck!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to join challenge');
    }
  };



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
      case 'climate_change': return '🌍'
      case 'wildlife': return '🦋'
      case 'recycling': return '♻️'
      case 'energy': return '⚡'
      case 'water': return '💧'
      case 'pollution': return '🏭'
      default: return '🌱'
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Star },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: Brain },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'ngos', label: 'NGOs', icon: Heart },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'chatbot', label: 'Chat with AI', icon: ChartAreaIcon}
  ]

  // Render feature pages with newly earned badges prop
  if (activeTab === 'profile') {
    return <StudentProfile onBack={() => setActiveTab('dashboard')} />
  }

  if (activeTab === 'badges') {
    return (
      <BadgesPage
        onBack={() => setActiveTab('dashboard')}
        newlyEarnedBadges={newlyEarnedBadges}
        onClearNewBadges={() => setNewlyEarnedBadges([])}
      />
    )
  }

  if (activeTab === 'chatbot') {
    return <ChatBot onBack={() => setActiveTab('dashboard')} />
  }

  if (activeTab === 'quizzes') {
    return <QuizzesPage onBack={() => setActiveTab('dashboard')} />
  }

  if (activeTab === 'lessons') {
    return <LessonPage onBack={() => setActiveTab('dashboard')} />
  }

  if (activeTab === 'ngos') {
    return <NGOsPage onBack={() => setActiveTab('dashboard')} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center flex flex-col justify-center items-center gap-5">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
          <p className="text-lg text-gray-600">Loading your eco-adventure...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen relative bg-gradient-to-br from-green-50 via-green-100 to-green-200">

      {video && <div className='fixed bottom-10 w-70 h-35 z-100 right-10 bg-blue-500 text-white rounded-lg overflow-hidden shadow-lg'>
            <video src="/public/video.mp4" autoPlay loop muted playsInline className='w-full h-full object-cover'></video>
            <X onClick={()=> setVideo(prev => !prev)} className='absolute right-3 top-3 cursor-pointer hover:bg-white hover:text-green-700 rounded-full text-white'/>
      </div>}
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer">
              <div className="bg-gradient-to-r hidden sm:flex from-green-400 to-blue-500 p-2 rounded-lg mr-3">
                <Star className="text-white " size={24} />
              </div>
              <h1 className="text-2xl flex flex-col md:flex-row font-bold text-gray-800 font-fredoka">EcoLearn <span className='text-green-500 hover:text-green-700 '>Student</span></h1>
            </div>

            <div className="flex gap-3 items-center space-x-4">
              {student && (
                <motion.div
                  key={student.eco_points} // Re-animate when points change
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 justify-center bg-gradient-to-r py-2 from-green-100 to-blue-100 px-2 md:px-4  rounded-full"
                >
                  <Zap className="text-green-600 " size={20} />
                  <span className="font-bold text-green-800">{student.eco_points}</span>
                </motion.div>
              )}

              <button
                onClick={manualRefresh}
                disabled={refreshing}
                className="hidden sm:flex items-center text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                title="Refresh content"
              >
                <RefreshCw size={20} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <div>
                <div onClick={() => setOpen(prev => !prev)} className='w-10 h-10 rounded-full overflow-hidden bg-gray-300'>
                  <img src="./public/bg.jpg" className=' h-full w-full ' alt="" />
                </div>
                {open && <div className='absolute flex flex-col items-start justify-center gap-2 top-[70px] right-45 bg-white shadow-lg rounded-lg w-35 h-25'>
                  <p onClick={() => navigate('/create-profile')} className='flex pl-3 items-center  gap-2 h-8 cursor-pointer hover:bg-green-500 w-full text-gray-600 font-medium'><User2 className='w-4 h-4' /> Profile</p>
                  <p className='flex pl-3 items-center  gap-2 h-8 cursor-pointer hover:bg-green-500 w-full text-gray-600 font-medium'><Settings className='w-4 h-4' /> Account</p>
                  <p onClick={userSignOut} className='flex pl-3 items-center  gap-2 h-8 cursor-pointer hover:bg-green-600 w-full text-red-600 font-medium'><LogOutIcon className='w-4 h-4' /> Logout</p>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-600 transition duration-500 ease-in-out hover:shadow-[0_0_15px_#22c55e,0_0_30px_#3b82f6] rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-fredoka">
                Welcome back, <span className='text-gray-800'>{student?.name || user?.userName}!</span> 🌟
              </h2>
              <p className="text-lg opacity-90">
                Ready to continue your eco-adventure? Let's save the planet together!
              </p>
              {student?.badges && student.badges.length > 0 && (
                <p className="text-sm opacity-75 mt-2">
                  🏆 You have {student.badges.length} badge{student.badges.length !== 1 ? 's' : ''} - share them with friends!
                </p>
              )}
            </div>
            <div className="hidden md:block">
              <div className="text-6xl animate-bounce">🌍</div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white sticky top-[70px] z-50 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 whitespace-nowrap transition-colors relative ${activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={20} className="mr-2" />
                  {tab.label}
                  {tab.id === 'badges' && student?.badges && student.badges.length > 0 && (
                    <motion.span
                      key={student.badges.length} // Re-animate when badge count changes
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                    >
                      {student.badges.length}
                    </motion.span>
                  )}
                  {tab.id === 'badges' && newlyEarnedBadges.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs rounded-full px-2 py-1 font-bold"
                    >
                      NEW!
                    </motion.div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl transition duration-500 ease-in-out hover:shadow-[0_0_15px_#22c55e,0_0_30px_#3b82f6] shadow-sm p-6 md:col-span-2 lg:col-span-3"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-fredoka">Your Progress 📊</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 text-green-800 bg-green-50 hover:bg-green-600 hover:text-white hover:scale-105
                   transition-all duration-300 ease-in-out rounded-lg">
                    <motion.div
                      key={student?.completed_lessons?.length}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold"
                    >
                      {student?.completed_lessons?.length || 0}
                    </motion.div>
                    <div className="text-sm">Lessons</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 hover:bg-blue-600 text-blue-800 hover:text-white hover:scale-105
                   transition-all duration-300 ease-in-out rounded-lg">
                    <motion.div
                      key={student?.quiz_scores?.length}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold"
                    >
                      {student?.quiz_scores?.length || 0}
                    </motion.div>
                    <div className="text-sm">Quizzes</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 text-purple-800 hover:text-white hover:bg-purple-600 hover:scale-105
                   transition-all duration-300 ease-in-out rounded-lg">
                    <motion.div
                      key={student?.badges?.length}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold"
                    >
                      {student?.badges?.length || 0}
                    </motion.div>
                    <div className="text-sm ">Badges</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 text-orange-800 hover:text-white hover:bg-orange-600 hover:scale-105
                   transition-all duration-300 ease-in-out rounded-lg">
                    <motion.div
                      key={student?.level}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold"
                    >
                      {student?.level || 1}
                    </motion.div>
                    <div className="text-sm">Level</div>
                  </div>
                </div>
              </motion.div>

              {/* Recent Badges with NEW indicator */}
              {student?.badges && student.badges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl hover:shadow-2xl hover:-translate-y-2
                transition-all duration-500 ease-in-out shadow-sm p-6 relative"
                >
                  {newlyEarnedBadges.length > 0 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                    >
                      🎉 NEW BADGES!
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 font-fredoka">Recent Badges</h3>
                    <button
                      onClick={() => setActiveTab('badges')}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                    >
                      View All →
                      {newlyEarnedBadges.length > 0 && (
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="ml-1 text-yellow-500"
                        >
                          ✨
                        </motion.span>
                      )}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {student.badges.slice(-3).map((badge, index) => {
                      const isNew = newlyEarnedBadges.some(newBadge => newBadge.badge_id === badge.badge_id)
                      return (
                        <motion.div
                          key={badge.badge_id}
                          initial={isNew ? { scale: 0, opacity: 0 } : false}
                          animate={isNew ? { scale: 1, opacity: 1 } : false}
                          transition={{ delay: index * 0.2 }}
                          className={`flex items-center p-3 rounded-lg border ${isNew
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                            : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                            }`}
                        >
                          <span className="text-2xl mr-3">{badge.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm flex items-center">
                              {badge.name}
                              {isNew && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                                >
                                  NEW!
                                </motion.span>
                              )}
                            </h4>
                            <p className="text-xs text-gray-600">{new Date(badge.earned_at).toLocaleDateString()}</p>
                          </div>
                          <button
                            onClick={() => setActiveTab('badges')}
                            className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center"
                          >
                            <Share2 size={12} className="mr-1" />
                            Share
                          </button>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Points to Next Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl transition duration-500  hover:shadow-[0_0_15px_#22c55e,0_0_30px_#3b82f6] hover:-translate-y-2
                 ease-in-out shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 font-fredoka">Next Achievement</h3>
                  <Award className="text-yellow-500" size={20} />
                </div>

                {(() => {
                  const currentPoints = student?.eco_points || 0
                  const earnedBadgeIds = student?.badges?.map(b => b.badge_id) || []
                  const nextBadge = availableBadges
                    .filter(badge => !earnedBadgeIds.includes(badge.badge_id))
                    .sort((a, b) => a.points_required - b.points_required)[0]

                  if (!nextBadge) {
                    return (
                      <div className="text-center py-4">
                        <div className="text-3xl mb-2">🏆</div>
                        <p className="text-gray-600 font-medium">All badges earned!</p>
                        <p className="text-sm text-gray-500">You're an eco champion!</p>
                      </div>
                    )
                  }

                  const progress = Math.min((currentPoints / nextBadge.points_required) * 100, 100)
                  const pointsNeeded = Math.max(nextBadge.points_required - currentPoints, 0)

                  return (
                    <div>
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{nextBadge.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{nextBadge.name}</h4>
                          <p className="text-xs text-gray-600">{nextBadge.requirement}</p>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{currentPoints} points</span>
                          <span>{nextBadge.points_required} points</span>
                        </div>
                        <div className="w-full bg-gray-200 hover:shadow-2xl hover:-translate-y-2
                transition-all duration-500 ease-in-out rounded-full h-2">
                          <motion.div
                            key={currentPoints} // Re-animate when points change
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                          />
                        </div>
                      </div>

                      <p className="text-xs text-center text-gray-600">
                        {pointsNeeded > 0 ? `${pointsNeeded} more points to unlock!` : 'Ready to unlock! 🎉'}
                      </p>
                    </div>
                  )
                })()}
              </motion.div>

              {/* Recent Lessons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: student?.badges?.length ? 0.3 : 0.2 }}
                className="bg-white rounded-xl hover:-translate-y-2
                transition duration-500 ease-in-out hover:shadow-[0_0_15px_#22c55e,0_0_30px_#3b82f6] shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 font-fredoka">Recent Lessons</h3>
                  <button
                    onClick={() => setActiveTab('lessons')}
                    className="text-green-600 hover:text-green-700 cursor-pointer text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {lessons.slice(0, 3).map((lesson) => {
                    const isCompleted = student?.completed_lessons?.includes(lesson._id)
                    return (
                      <div key={lesson._id} className="flex items-center p-3 transform transition hover:bg-green-200 duration-300 hover:scale-110 bg-gray-50 rounded-lg">
                        <span className="text-xl mr-3">{getCategoryEmoji(lesson.category)}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{lesson.title}</h4>
                          <p className="text-xs text-gray-600">{lesson.estimated_duration} min • +{lesson.eco_points_reward} pts</p>
                        </div>
                        {isCompleted ? (
                          <div className="text-green-600">✅</div>
                        ) : (
                          <button
                            onClick={() => completeLesson(lesson._id, lesson.eco_points_reward)}
                            className="text-blue-600 hover:text-blue-700 text-xs font-medium bg-blue-50 px-2 py-1 rounded"
                          >
                            Start
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Available Quizzes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: student?.badges?.length ? 0.4 : 0.3 }}
                className="bg-white hover:-translate-y-2
                transition duration-500 ease-in-out hover:shadow-[0_0_15px_#22c55e,0_0_30px_#3b82f6] rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 font-fredoka">Available Quizzes</h3>
                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {quizzes.slice(0, 3).map((quiz) => (
                    <div key={quiz._id} className="flex items-center transform transition hover:bg-green-200 duration-300 hover:scale-110 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl mr-3">{getCategoryEmoji(quiz.category)}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{quiz.title}</h4>
                        <p className="text-xs text-gray-600">{quiz.time_limit} min • {quiz.eco_points_reward} pts</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('quizzes')}
                        className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                      >
                        Take
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Active NGO Campaigns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: student?.badges?.length ? 0.5 : 0.4 }}
                className="bg-white hover:-translate-y-2
                transition duration-500 ease-in-out hover:shadow-[0_0_15px_#22c55e,0_0_30px_#3b82f6] rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 font-fredoka">NGO Campaigns</h3>
                  <button
                    onClick={() => setActiveTab('ngos')}
                    className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign._id} className="flex transform transition hover:bg-green-200 duration-300 hover:scale-110 items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl mr-3">{getCategoryEmoji(campaign.category)}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{campaign.title}</h4>
                        <p className="text-xs text-gray-600">{campaign.location} • {campaign.current_participants} participants</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('ngos')}
                        className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                      >
                        Join
                      </button>
                    </div>
                  ))}

                  {campaigns.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No campaigns available yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Other tabs content (lessons, quizzes, challenges, leaderboard) remain the same... */}
          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {lessons.map((lesson) => {
                const isCompleted = student?.completed_lessons?.includes(lesson._id)

                return (
                  <motion.div
                    key={lesson._id}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-white rounded-xl hover:shadow-2xl hover:-translate-y-2
                transition-all duration-500 ease-in-out shadow-sm overflow-hidden border-2 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-green-200'
                      }`}
                  >
                    <img
                      src={lesson.media_url}
                      alt={lesson.title}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{getCategoryEmoji(lesson.category)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                          {lesson.difficulty}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 mb-2">{lesson.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lesson.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="mr-1" size={16} />
                          {lesson.eco_points_reward} points
                        </div>
                        <div className="text-sm text-gray-500">
                          {lesson.estimated_duration} min
                        </div>
                      </div>

                      <button
                        onClick={() => !isCompleted && completeLesson(lesson._id, lesson.eco_points_reward)}
                        disabled={isCompleted}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${isCompleted
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
                          }`}
                      >
                        {isCompleted ? '✅ Completed' : 'Start Lesson'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {challenges.map((challenge) => {
                const isJoined = challenge.participants.some(p => p.student_id === student?._id)
                return (
                  <motion.div
                    key={challenge._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{getCategoryEmoji(challenge.category)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{challenge.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="mr-1" size={16} />
                        {challenge.eco_points_reward} points
                      </div>
                      <div className="text-sm text-gray-500">
                        {challenge.duration_days} days
                      </div>
                    </div>

                    <button
                      onClick={() => !isJoined && joinChallenge(challenge._id)}
                      disabled={isJoined}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${isJoined
                        ? 'bg-orange-100 text-orange-800 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                        }`}
                    >
                      {isJoined ? '✅ Joined' : 'Join Challenge'}
                    </button>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-fredoka">🏆 Eco Champions Leaderboard</h3>
                <p className="text-gray-600">See how you rank among your fellow eco-warriors!</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {leaderboard.map((studentItem, index) => (
                    <motion.div
                      key={studentItem._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center p-4 rounded-lg border-2 transition-all ${studentItem._id === student?._id
                        ? 'border-green-300 bg-green-50 shadow-md'
                        : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{studentItem.name}</h4>
                        <p className="text-sm text-gray-600">{studentItem.grade} • {studentItem.school}</p>
                      </div>

                      <div className="text-right">
                        <motion.div
                          key={studentItem.eco_points}
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.3 }}
                          className="font-bold text-green-600"
                        >
                          {studentItem.eco_points}
                        </motion.div>
                        <div className="text-sm text-gray-500">eco points</div>
                      </div>

                      <div className="ml-4 text-right">
                        <div className="font-bold text-blue-600">Level {studentItem.level}</div>
                        <div className="text-sm text-gray-500">{studentItem.completed_lessons?.length || 0} lessons</div>
                      </div>

                      {studentItem._id === student?._id && (
                        <div className="ml-4">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">You!</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
