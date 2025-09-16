import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, MapPin, Calendar, Globe, Heart, Star, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import { useContext } from 'react'
import { userDataContext } from '../../Context/UserContext'

const NGOsPage = ({ onBack }) => {
    const { user, axios } = useContext(userDataContext);
    const [campaigns, setCampaigns] = useState([])
    const [student, setStudent] = useState(null)
    const [selectedNGO, setSelectedNGO] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [loading, setLoading] = useState(true)

    const ngos = [
        {
            id: 'ngo_001',
            name: 'Green Earth Foundation',
            description: 'Dedicated to environmental conservation and education for a sustainable future.',
            mission: 'To protect and preserve our planet through education, conservation, and community action.',
            website: 'https://greenearth.org',
            location: 'Global',
            founded_year: 2010,
            focus_areas: ['Climate Change', 'Reforestation', 'Education'],
            logo: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
            campaigns_count: 15,
            total_participants: 2500,
            impact_stats: {
                trees_planted: 50000,
                waste_collected: '25 tons',
                students_educated: 10000
            }
        },
        {
            id: 'ngo_002',
            name: 'Ocean Guardians',
            description: 'Protecting marine life and ocean ecosystems through cleanup and conservation efforts.',
            mission: 'To safeguard our oceans and marine life for future generations.',
            website: 'https://oceanguardians.org',
            location: 'Coastal Regions',
            founded_year: 2015,
            focus_areas: ['Marine Conservation', 'Beach Cleanup', 'Plastic Reduction'],
            logo: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
            campaigns_count: 8,
            total_participants: 1200,
            impact_stats: {
                trees_planted: 5000,
                waste_collected: '15 tons',
                students_educated: 3000
            }
        },
        {
            id: 'ngo_003',
            name: 'Solar Future Initiative',
            description: 'Promoting renewable energy education and solar power adoption in schools.',
            mission: 'To accelerate the transition to clean energy through education and community projects.',
            website: 'https://solarfuture.org',
            location: 'Urban Areas',
            founded_year: 2018,
            focus_areas: ['Renewable Energy', 'Solar Education', 'Sustainability'],
            logo: 'https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg',
            campaigns_count: 12,
            total_participants: 1800,
            impact_stats: {
                trees_planted: 12000,
                waste_collected: '8 tons',
                students_educated: 5000
            }
        },
        {
            id: 'ngo_004',
            name: 'Wildlife Protectors',
            description: 'Conserving endangered species and their habitats through education and action.',
            mission: 'To protect wildlife and biodiversity through conservation and education programs.',
            website: 'https://wildlifeprotectors.org',
            location: 'National Parks',
            founded_year: 2012,
            focus_areas: ['Wildlife Conservation', 'Habitat Protection', 'Biodiversity'],
            logo: 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg',
            campaigns_count: 10,
            total_participants: 900,
            impact_stats: {
                trees_planted: 30000,
                waste_collected: '5 tons',
                students_educated: 2500
            }
        }
    ]

    const categories = [
        { id: 'all', name: 'All NGOs', icon: '🌍' },
        { id: 'climate', name: 'Climate Action', icon: '🌡️' },
        { id: 'ocean', name: 'Ocean Protection', icon: '🌊' },
        { id: 'energy', name: 'Clean Energy', icon: '⚡' },
        { id: 'wildlife', name: 'Wildlife Conservation', icon: '🦋' },
        { id: 'education', name: 'Environmental Education', icon: '📚' }
    ]

    useEffect(() => {
        fetchCampaigns()
        fetchStudentData()
    }, [user])

    const fetchCampaigns = async () => {
        try {
            const res = await axios.get('/api/campaigns')
            setCampaigns(res.data.list || [])
        } catch (error) {
            console.error('Failed to fetch campaigns:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStudentData = async () => {
        try {
            const res = await axios.get('/api/students');
            if(res.data.success) {
                setStudent(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch student data:', error)
        }
    }

    const joinCampaign = async (campaignId) => {
        if (!student) {
            toast.error('Please complete your profile first!')
            return
        }

        try {
            const campaign = campaigns.find(c => c._id === campaignId)
            if (!campaign) return

            if (!campaign.participating_schools.includes(student.school)) {
                toast.error('This campaign is not available for your school yet. Ask your teacher to join!')
                return
            }

            toast.success('🎉 Successfully joined the campaign! Check your dashboard for updates.')
        } catch (error) {
            console.log(error);
            toast.error('Failed to join campaign')
        }
    }

    const getCategoryEmoji = (category) => {
        switch (category) {
            case 'awareness': return '📢'
            case 'beach_cleanup': return '🏖️'
            case 'energy_conservation': return '⚡'
            case 'tree_planting': return '🌳'
            default: return '🌱'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'planning':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    const filteredNGOs = selectedCategory === 'all'
        ? ngos
        : ngos.filter(ngo => {
            switch (selectedCategory) {
                case 'climate':
                    return ngo.focus_areas.some(area => area.toLowerCase().includes('climate'))
                case 'ocean':
                    return ngo.focus_areas.some(area => area.toLowerCase().includes('marine') || area.toLowerCase().includes('ocean'))
                case 'energy':
                    return ngo.focus_areas.some(area => area.toLowerCase().includes('energy') || area.toLowerCase().includes('solar'))
                case 'wildlife':
                    return ngo.focus_areas.some(area => area.toLowerCase().includes('wildlife') || area.toLowerCase().includes('biodiversity'))
                case 'education':
                    return ngo.focus_areas.some(area => area.toLowerCase().includes('education'))
                default:
                    return true
            }
        })

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center flex flex-col items-center justify-center gap-5">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
                    <p className="text-lg text-gray-600">Loading NGOs...</p>
                </div>
            </div>
        )
    }

    if (selectedNGO) {
        const ngoCampaigns = campaigns.filter(c => c.ngo_id === selectedNGO.id)

        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                {/* Header */}
                <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-green-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-16">
                            <button
                                onClick={() => setSelectedNGO(null)}
                                className="flex items-center text-green-500 hover:text-green-700 transition-colors mr-4"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back to NGOs
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">{selectedNGO.name}</h1>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* NGO Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
                    >
                        <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 p-6 text-white">
                            <div className="flex items-center">
                                <img
                                    src={selectedNGO.logo}
                                    alt={selectedNGO.name}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white mr-6"
                                />
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-2 font-fredoka">{selectedNGO.name}</h2>
                                    <p className="text-lg opacity-90 mb-2">{selectedNGO.description}</p>
                                    <div className="flex items-center space-x-4 text-sm opacity-80">
                                        <div className="flex items-center">
                                            <MapPin size={16} className="mr-1" />
                                            {selectedNGO.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar size={16} className="mr-1" />
                                            Founded {selectedNGO.founded_year}
                                        </div>
                                        <div className="flex items-center">
                                            <Globe size={16} className="mr-1" />
                                            <a href={selectedNGO.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                Website
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 font-fredoka">Mission</h3>
                            <p className="text-gray-600 mb-6">{selectedNGO.mission}</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-6">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{selectedNGO.campaigns_count}</div>
                                    <div className="text-sm text-green-800">Active Campaigns</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{selectedNGO.total_participants.toLocaleString()}</div>
                                    <div className="text-sm text-blue-800">Total Participants</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{selectedNGO.impact_stats.students_educated.toLocaleString()}</div>
                                    <div className="text-sm text-purple-800">Students Educated</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800 mb-3">Focus Areas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedNGO.focus_areas.map((area, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium"
                                        >
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Impact Statistics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 mb-8"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6 font-fredoka">Environmental Impact 🌍</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                <div className="text-4xl mb-2">🌳</div>
                                <div className="text-2xl font-bold text-green-600">{selectedNGO.impact_stats.trees_planted.toLocaleString()}</div>
                                <div className="text-sm text-green-800">Trees Planted</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                <div className="text-4xl mb-2">♻️</div>
                                <div className="text-2xl font-bold text-blue-600">{selectedNGO.impact_stats.waste_collected}</div>
                                <div className="text-sm text-blue-800">Waste Collected</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                <div className="text-4xl mb-2">📚</div>
                                <div className="text-2xl font-bold text-purple-600">{selectedNGO.impact_stats.students_educated.toLocaleString()}</div>
                                <div className="text-sm text-purple-800">Students Educated</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Available Campaigns */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6 font-fredoka">Available Campaigns 🎯</h3>

                        {ngoCampaigns.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {ngoCampaigns.map((campaign, index) => (
                                    <motion.div
                                        key={campaign._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border border-gray-200 rounded-lg p-6 hover:border-green-200 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-2xl">{getCategoryEmoji(campaign.category)}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                {campaign.status}
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-bold text-gray-800 mb-2">{campaign.title}</h4>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{campaign.description}</p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1" size={14} />
                                                    {new Date(campaign.start_date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="mr-1" size={14} />
                                                    {campaign.location}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Users className="mr-1" size={14} />
                                                    {campaign.current_participants}/{campaign.target_participants} joined
                                                </div>
                                                <div className="flex items-center">
                                                    <Target className="mr-1" size={14} />
                                                    {campaign.activities.length} activities
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-sm text-gray-500 mb-1">Participation Progress</div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                                                    style={{ width: `${Math.min((campaign.current_participants / campaign.target_participants) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => joinCampaign(campaign._id)}
                                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-colors"
                                        >
                                            Join Campaign
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Target size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No active campaigns from this NGO at the moment.</p>
                                <p className="text-sm">Check back later for new opportunities!</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        )
    }

    // NGO List View
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-green-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <button
                            onClick={onBack}
                            className="flex items-center text-green-500 hover:text-green-700 transition-colors mr-4"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Environmental NGOs</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl p-6 mb-8 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 font-fredoka">Join Environmental Heroes! 🦸‍♀️</h2>
                            <p className="text-lg opacity-90">
                                Connect with NGOs and participate in campaigns to make a real difference!
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-6xl animate-pulse">🌍</div>
                        </div>
                    </div>
                </motion.div>

                {/* Category Filter */}
                <div className="bg-white rounded-xl sticky top-[65px] z-50 shadow-sm mb-8 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center px-6 py-4 whitespace-nowrap transition-colors ${selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-2 text-lg">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* NGOs Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNGOs.map((ngo, index) => (
                        <motion.div
                            key={ngo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedNGO(ngo)}
                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:border-green-200 transition-all cursor-pointer"
                        >
                            <img
                                src={ngo.logo}
                                alt={ngo.name}
                                className="w-full h-48 object-cover"
                            />

                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{ngo.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ngo.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <MapPin className="mr-1" size={14} />
                                            {ngo.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="mr-1" size={14} />
                                            Since {ngo.founded_year}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Target className="mr-1" size={14} />
                                            {ngo.campaigns_count} campaigns
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="mr-1" size={14} />
                                            {ngo.total_participants.toLocaleString()} participants
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Focus Areas</div>
                                    <div className="flex flex-wrap gap-1">
                                        {ngo.focus_areas.slice(0, 3).map((area, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                        {ngo.focus_areas.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                +{ngo.focus_areas.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-yellow-500">
                                        <Star className="mr-1" size={16} />
                                        <span className="text-sm font-medium">4.8</span>
                                    </div>
                                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                                        Learn More →
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredNGOs.length === 0 && (
                    <div className="text-center py-12">
                        <Heart size={64} className="mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No NGOs found</h3>
                        <p className="text-gray-500">Try selecting a different category to see more organizations.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NGOsPage
