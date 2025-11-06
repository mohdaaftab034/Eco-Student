import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Users, GraduationCap, Heart } from 'lucide-react'
// import { useAuth } from '../hooks/useAuth'
import { setSelectedRole } from '../App'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AboutPage from '../components/AboutPage'


const LandingPage = () => {
    const [selectedRole, setSelectedRoleLocal] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    // const { signIn } = useAuth()

    const handleRoleSelection = (role) => {
        setSelectedRoleLocal(role);
        setSelectedRole(role)
    }

    const handleLogin = async () => {
        if (!selectedRole) {
            toast.error('Please select your role first!')
            return
        }

        setIsLoading(true)
        try {
            // Store role before signing in
            setSelectedRole(selectedRole)

            // Role-based success messages
            if (selectedRole === 'teacher') {
                navigate('/teacher-login');
                toast.success('Redirecting to Teacher Account... 👩‍🏫', { delay: 500 })
            } else if (selectedRole === 'ngo') {
                navigate('/ngo-login');
                toast.success('Redirecting to NGO Account... 🤝', { delay: 500 })
            } else {
                navigate('/student-login');
                toast.success('Redirecting to Student Account... 🎓', { delay: 500 })
            }
        } catch (error) {
            toast.error('Login failed. Please try again.')
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }


    const roles = [
        {
            id: 'student',
            title: 'Student',
            subtitle: 'Learn & Explore',
            description: 'Join the eco-adventure! Learn about environment, earn points, and save the planet!',
            icon: GraduationCap,
            color: 'from-green-400 to-blue-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200 hover:border-green-400'
        },
        {
            id: 'teacher',
            title: 'Teacher',
            subtitle: 'Educate & Guide',
            description: 'Create engaging lessons, track student progress, and inspire the next generation of eco-warriors!',
            icon: Users,
            color: 'from-blue-400 to-purple-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200 hover:border-blue-400'
        },
        {
            id: 'ngo',
            title: 'NGO',
            subtitle: 'Campaign & Impact',
            description: 'Organize campaigns, create challenges, and collaborate with schools to make a real difference!',
            icon: Heart,
            color: 'from-purple-400 to-pink-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200 hover:border-purple-400'
        }
    ]

    return (
        <div className="min-h-screen bg-[var(--bg-color)] gap-10 flex-col flex items-center justify-center p-4" style={{
            backgroundImage: "url('')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%"
        }}>
            <div className="max-w-4xl w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center mb-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="bg-[var(--secondary-color)] p-4 rounded-full mr-4"
                        >
                            <Leaf className="text-black" size={48} />
                        </motion.div>
                        <h1 className="text-6xl font-bold text-[var(--text-color)]">
                            EcoLearn
                        </h1>
                    </div>
                    <p className="text-3xl text-[var(--text-color)] font-bold mb-2"><span className='bg-[var(--primary-color)] text-black rounded-md p-1'>Environmental</span> Education Platform</p>
                    <p className="text-xl rounded-full py-1 bg-[var(--secondary-color)] text-black drop-shadow-2xl font-bold">Choose your role to start your eco-journey! 🌍</p>
                </motion.div>

                {/* Role Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid md:grid-cols-3 gap-6 mb-8"
                >
                    {roles.map((role, index) => {
                        const Icon = role.icon
                        const isSelected = selectedRole === role.id

                        return (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRoleSelection(role.id)}
                                className={`
                  relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300
                  ${isSelected
                                        ? `${role.bgColor} ${role.borderColor.split(' ')[1]} shadow-lg ring-4 ring-opacity-30 ${role.borderColor.includes('green') ? 'ring-green-200' : role.borderColor.includes('blue') ? 'ring-blue-200' : 'ring-purple-200'}`
                                        : `bg-[var(--secondary-color)] ${role.borderColor} hover:shadow-md`
                                    }`}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="selectedRole"
                                        className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl opacity-50"
                                    />
                                )}

                                <div className="relative z-10">
                                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${role.color} mb-4`}>
                                        <Icon className="text-white" size={32} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-800 mb-2 font-fredoka">{role.title}</h3>
                                    <p className="text-lg font-medium text-gray-600 mb-3">{role.subtitle}</p>
                                    <p className="text-gray-500 leading-relaxed">{role.description}</p>

                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-4 flex items-center justify-center"
                                        >
                                            <div className="bg-green-800 text-white px-4 py-2 rounded-full text-sm font-medium">
                                                ✓ Selected
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Login Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogin}
                        disabled={!selectedRole || isLoading}
                        className={`
              px-12 py-4 rounded-full text-xl font-bold transition-all duration-300
              ${selectedRole
                                ? 'bg-[var(--secondary-color)] text-black shadow-lg hover:shadow-xl'
                                : 'bg-gray-200 text-gray-900 cursor-not-allowed'
                            }
              ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
            `}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                Signing In...
                            </div>
                        ) : (
                            `Start as ${selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : 'User'} 🚀`
                        )}
                    </motion.button>

                    <p className="text-gray-500 mt-4 text-sm">
                        Safe and secure login powered by Eco Learn Platform
                    </p>

                    {selectedRole && (
                        <div className="mt-4 text-xs text-gray-400">
                            Selected Role: {selectedRole} | Will redirect to {selectedRole} dashboard
                        </div>
                    )}
                </motion.div>

                {/* Fun Elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <div className="flex justify-center space-x-8 text-4xl">
                        <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>🌱</motion.span>
                        <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>🌍</motion.span>
                        <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>🌳</motion.span>
                        <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>♻️</motion.span>
                        <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}>🐝</motion.span>
                    </div>
                </motion.div>
            </div>

        </div>
    )
}

export default LandingPage
