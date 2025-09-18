import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, BarChart3, School, Target, LogOut, Plus, MapPin, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { userDataContext } from '../Context/UserContext'
import Footer from '../components/Footer'

const NGODashboard = () => {
  const { user, axios, userSignOut } = useContext(userDataContext)
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState([])
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])


  const fetchData = async () => {
    try {
      const [campaignsRes, challengesRes] = await Promise.all([
        axios.get("/api/campaigns"),
        axios.get("/api/challenges")
      ])

      console.log(campaignsRes, challengesRes);

      setCampaigns(campaignsRes.data.list || [])
      setChallenges(challengesRes.data.list || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async (formData) => {
    try {
      const activitiesData = []
      let i = 0

      while (formData.get(`activity_name_${i}`)) {
        activitiesData.push({
          name: formData.get(`activity_name_${i}`),
          description: formData.get(`activity_description_${i}`),
          duration: Number(formData.get(`activity_duration_${i}`)),
          eco_points: Number(formData.get(`activity_points_${i}`))
        })
        i++
      }

      const schoolsArray = (formData.get('participating_schools') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const campaignData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        start_date: new Date(formData.get('start_date')).toISOString(),
        end_date: new Date(formData.get('end_date')).toISOString(),
        location: formData.get('location'),
        target_participants: Number(formData.get('target_participants')),
        current_participants: 0,
        impact_goal: formData.get('impact_goal'),
        activities: activitiesData,
        participating_schools: schoolsArray,
        ngo_id: user?._id || '',
        status: 'planning',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const res = await axios.post("/api/campaigns", campaignData)

      if (res.data.success) {
        const newCampaign = res.data.campaign
        setCampaigns([newCampaign, ...campaigns])
        setShowCreateCampaign(false)

        toast.success("🎉 Campaign created successfully! Students can now see and join it.")
      } else {
        toast.error(res.data.message || "Failed to create campaign")
      }
    } catch (error) {
      console.error('Failed to create campaign:', error)
      toast.error('Failed to create campaign')
    }
  }


  const createEvent = async (formData) => {
    try {
      const instructionsArray = (formData.get("instructions") || "")
        .split("\n")
        .filter(Boolean)

      const challengeData = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        difficulty: formData.get("difficulty"),
        eco_points_reward: Number(formData.get("eco_points_reward")),
        duration_days: Number(formData.get("duration_days")),
        verification_type: formData.get("verification_type"),
        instructions: instructionsArray,
        participants: [],
        ngo_id: user?._id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // 🔹 API call to backend
      const res = await axios.post("/api/challenges", challengeData)

      if (res.data.success) {
        const newChallenge = res.data.challenge
        setChallenges([newChallenge, ...challenges])
        setShowCreateEvent(false)

        toast.success("🎯 Challenge created successfully! Students can now participate.")
      } else {
        toast.error(res.data.message || "Failed to create challenge")
      }
    } catch (error) {
      console.error("Failed to create challenge:", error)
      toast.error("Failed to create challenge")
    }
  }


  const updateCampaignStatus = async (id, status) => {
    try {
      const res = await axios.put(`/api/campaigns/${id}/status`, { status })

      if (res.data.success) {
        setCampaigns(campaigns.map((c) => (c._id === id ? { ...c, status } : c)))
        toast.success(`Campaign status updated to ${status}`)
      } else {
        toast.error(res.data.message || "Failed to update campaign status")
      }
    } catch (error) {
      console.error("Failed to update campaign status:", error)
      toast.error("Failed to update campaign status")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'tree_planting': return '🌳'
      case 'beach_cleanup': return '🏖️'
      case 'awareness': return '📢'
      case 'recycling_drive': return '♻️'
      case 'energy_conservation': return '⚡'
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
    { id: 'campaigns', label: 'Campaigns', icon: Calendar },
    { id: 'events', label: 'Events & Challenges', icon: Target },
    { id: 'participation', label: 'Participation', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'schools', label: 'School Collaboration', icon: School }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaff] flex items-center justify-center">
        <div className="text-center flex flex-col justify-center items-center gap-5">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mb-4"></div>
          <p className="text-lg text-black">Loading NGO dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaff]">
      {/* Header */}
      <header className="bg-[#fafaff] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer">
              <div className="bg-black p-2 rounded-lg mr-3">
                <Target className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 font-fredoka">EcoLearn <span className='text-green-800 '>NGO</span></h1>
            </div>

            <div className="flex gap-3 items-center space-x-4">
              <div className="text-sm text-black">
                Welcome, {user?.ngoName}
              </div>
              <button
                onClick={userSignOut}
                className="flex items-center text-red-500 hover:text-red-700 transition-colors"
              >
                <LogOut size={20} className="mr-1" />
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
          className="bg-[#fafaff] rounded-md transition-transform duration-300 ease-in-out hover:scale-105 p-6 mb-8 text-black shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-fredoka">
                NGO Impact Dashboard 🌍
              </h2>
              <p className="text-lg font-light opacity-90">
                Create campaigns, organize events, and make a real difference in environmental education
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl animate-pulse">🤝</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 ease-in-out shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Active Campaigns</p>
                <p className="text-3xl font-bold text-green-800">
                  {campaigns.filter(c => c?.status === 'active').length}
                </p>
              </div>
              <Calendar className="text-emerald-700" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 ease-in-out shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Challenges</p>
                <p className="text-3xl font-bold text-emerald-700">{challenges.length}</p>
              </div>
              <Target className="text-emerald-700" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 ease-in-out shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Participants</p>
                <p className="text-3xl font-bold text-emerald-700">
                  {campaigns.reduce((sum, c) => sum + c?.current_participants, 0)}
                </p>
              </div>
              <Users className="text-emerald-700" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 ease-in-out shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Partner Schools</p>
                <p className="text-3xl font-bold text-emerald-700">
                  {new Set(campaigns.flatMap(c => c?.participating_schools)).size}
                </p>
              </div>
              <School className="text-emerald-700" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#fafaff] rounded-md sticky z-50 top-[70px] shadow-lg mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center cursor-pointer px-6 py-4 whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-gray-100'
                    }`}
                >
                  <Icon size={20} className="mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-black font-fredoka">Manage Campaigns</h3>
                <button
                  onClick={() => setShowCreateCampaign(true)}
                  className="flex items-center bg-emerald-700 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Create Campaign
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {campaigns?.map((campaign) => (
                  <motion.div
                    key={campaign?._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#fafaff] rounded-md shadow-lg border-gray-300 border-[1px] p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{getCategoryEmoji(campaign?.category)}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign?.status)}`}>
                        {campaign?.status}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-gray-800 mb-2">{campaign?.title}</h4>
                    <p className="text-black text-sm mb-4 line-clamp-3">{campaign?.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={16} className="mr-2" />
                        {campaign?.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        {new Date(campaign?.start_date).toLocaleDateString()} - {new Date(campaign?.end_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={16} className="mr-2" />
                        {campaign?.current_participants} / {campaign?.target_participants} participants
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-black mb-1">
                        <span>Progress</span>
                        <span>{Math.round((campaign?.current_participants / campaign?.target_participants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-700 h-2 rounded-full"
                          style={{ width: `${Math.min((campaign?.current_participants / campaign?.target_participants) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {campaign?.status === 'planning' && (
                        <button
                          onClick={() => updateCampaignStatus(campaign?._id, 'active')}
                          className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm hover:bg-green-200 transition-colors"
                        >
                          Launch
                        </button>
                      )}
                      {campaign?.status === 'active' && (
                        <button
                          onClick={() => updateCampaignStatus(campaign?._id, 'completed')}
                          className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Events & Challenges Tab */}
          {activeTab === 'events' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 font-fredoka">Events & Challenges</h3>
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="flex items-center bg-[#fafaff] text-white px-4 py-2 rounded-md shadow-lg transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Create Challenge
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge?._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg border border-gray-100 p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{getCategoryEmoji(challenge?.category)}</span>
                      <span className="text-sm text-gray-500">{challenge?.difficulty}</span>
                    </div>

                    <h4 className="text-lg font-bold text-gray-800 mb-2">{challenge?.title}</h4>
                    <p className="text-black text-sm mb-4 line-clamp-3">{challenge?.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{challenge?.duration_days} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Reward:</span>
                        <span className="font-medium text-green-600">{challenge?.eco_points_reward} points</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Participants:</span>
                        <span className="font-medium">{challenge?.participants.length}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-black mb-1">Participation Rate</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${Math.min((challenge?.participants.length / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <button className="w-full bg-emerald-200 py-2 rounded-lg text-sm hover:from-orange-200 hover:to-red-200 transition-colors">
                      View Participants
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Participation Tab */}
          {activeTab === 'participation' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 font-fredoka">Participation Tracking</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Campaign Participation</h4>
                  <div className="space-y-4">
                    {campaigns.slice(0, 5).map((campaign) => (
                      <div key={campaign?._id} className="flex items-center hover:bg-gray-100 justify-between p-3 bg-[#fafaff] rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-800">{campaign?.title}</h5>
                          <p className="text-sm text-gray-500">{campaign?.participating_schools.length} schools</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-purple-600">{campaign?.current_participants}</div>
                          <div className="text-sm text-gray-500">participants</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Challenge Completion</h4>
                  <div className="space-y-4">
                    {challenges?.slice(0, 5).map((challenge) => {
                      const completedCount = challenge?.participants.filter(p => p?.completed).length
                      const completionRate = challenge?.participants.length > 0
                        ? Math.round((completedCount / challenge?.participants.length) * 100)
                        : 0

                      return (
                        <div key={challenge?._id}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{challenge?.title}</span>
                            <span className="text-sm text-gray-500">{completionRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {completedCount} of {challenge.participants.length} completed
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 font-fredoka">Impact Reports</h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800">Environmental Impact</h4>
                    <TrendingUp className="text-green-500" size={24} />
                  </div>

                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">2,450</div>
                      <div className="text-sm text-black">Trees Planted</div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">5.2 tons</div>
                      <div className="text-sm text-black">Waste Collected</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">12,800</div>
                      <div className="text-sm text-black">Students Educated</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Campaign Performance</h4>
                  <div className="space-y-4">
                    {campaigns?.slice(0, 4).map((campaign) => {
                      const performance = Math.round((campaign?.current_participants / campaign?.target_participants) * 100)

                      return (
                        <div key={campaign?._id}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{campaign?.title}</span>
                            <span className="text-sm text-gray-500">{performance}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                              style={{ width: `${Math.min(performance, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-[#fafaff] rounded-md transition-transform duration-300 hover:scale-105 shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Monthly Growth</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">New Participants</span>
                      <span className="font-bold text-green-600">+342</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Partner Schools</span>
                      <span className="font-bold text-blue-600">+8</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Active Campaigns</span>
                      <span className="font-bold text-purple-600">+3</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Challenges Created</span>
                      <span className="font-bold text-orange-600">+12</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* School Collaboration Tab */}
          {activeTab === 'schools' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 font-fredoka">School Partnerships</h3>

              <div className="bg-[#fafaff] rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Partner Schools</h4>
                  <p className="text-black">Collaborate with schools to maximize environmental education impact</p>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from(new Set(campaigns.flatMap(c => c?.participating_schools))).map((school, index) => {
                      const schoolCampaigns = campaigns.filter(c => c?.participating_schools.includes(school))
                      const totalParticipants = schoolCampaigns.reduce((sum, c) => sum + c?.current_participants, 0)

                      return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-bold text-gray-800">{school}</h5>
                            <School className="text-indigo-500" size={20} />
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-black">Active Campaigns:</span>
                              <span className="font-medium">{schoolCampaigns.length}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-black">Total Participants:</span>
                              <span className="font-medium text-green-600">{totalParticipants}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-black">Partnership Since:</span>
                              <span className="font-medium">2024</span>
                            </div>
                          </div>

                          <button className="w-full mt-4 bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm hover:bg-indigo-200 transition-colors">
                            View Details
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#fafaff] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Campaign</h3>

              <form onSubmit={(e) => {
                e.preventDefault()
                createCampaign(new FormData(e.currentTarget))
              }}>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
                      <input
                        name="title"
                        type="text"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Earth Day Festival 2025"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        name="category"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="tree_planting">Tree Planting</option>
                        <option value="beach_cleanup">Beach Cleanup</option>
                        <option value="awareness">Awareness Campaign</option>
                        <option value="recycling_drive">Recycling Drive</option>
                        <option value="energy_conservation">Energy Conservation</option>
                        <option value="pollution_control">Pollution Control</option>
                        <option value="health_and_hygiene">Health & Hygiene</option>
                        <option value="climate_change">Climate Change</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe your campaign goals and activities"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        name="start_date"
                        type="date"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        name="end_date"
                        type="date"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Participants</label>
                      <input
                        name="target_participants"
                        type="number"
                        required
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        name="location"
                        type="text"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="City, State or Multiple Locations"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Participating Schools (comma-separated)</label>
                      <input
                        name="participating_schools"
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="School A, School B, School C"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Impact Goal</label>
                    <textarea
                      name="impact_goal"
                      required
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Plant 1000 trees, educate 500+ students, reduce waste by 2 tons"
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Campaign Activities</h4>

                    {[0, 1, 2].map((activityIndex) => (
                      <div key={activityIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-gray-800 mb-3">Activity {activityIndex + 1}</h5>

                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                          <input
                            name={`activity_name_${activityIndex}`}
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Activity name"
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <input
                              name={`activity_duration_${activityIndex}`}
                              type="number"
                              required
                              min="1"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Duration (min)"
                            />

                            <input
                              name={`activity_points_${activityIndex}`}
                              type="number"
                              required
                              min="1"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Eco points"
                            />
                          </div>
                        </div>

                        <textarea
                          name={`activity_description_${activityIndex}`}
                          required
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Activity description"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    Create Campaign
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateCampaign(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-black transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Event/Challenge Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#fafaff] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Challenge</h3>

              <form onSubmit={(e) => {
                e.preventDefault()
                createEvent(new FormData(e.currentTarget))
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Title</label>
                    <input
                      name="title"
                      type="text"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="30-Day Energy Saving Challenge"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Describe the challenge and its environmental impact"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        name="category"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="climate_change">Climate Change</option>
                        <option value="wildlife">Wildlife</option>
                        <option value="recycling">Recycling</option>
                        <option value="energy">Energy</option>
                        <option value="water">Water</option>
                        <option value="pollution">Pollution</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        name="difficulty"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                      <input
                        name="duration_days"
                        type="number"
                        required
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Eco Points Reward</label>
                      <input
                        name="eco_points_reward"
                        type="number"
                        required
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verification Type</label>
                      <select
                        name="verification_type"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        <option value="photo">Photo</option>
                        <option value="text">Text</option>
                        <option value="checklist">Checklist</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructions (one per line)</label>
                    <textarea
                      name="instructions"
                      required
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Turn off lights when leaving a room&#10;Unplug electronics when not in use&#10;Use natural light during the day&#10;Take shorter showers&#10;Ask family to adjust thermostat by 2 degrees"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-colors"
                  >
                    Create Challenge
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateEvent(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-black transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )

}

export default NGODashboard;