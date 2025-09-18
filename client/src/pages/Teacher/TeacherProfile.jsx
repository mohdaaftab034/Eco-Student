import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Mail,
    School,
    Calendar,
    Edit,
    Save,
    BookOpen,
    Users,
    Award,
    BarChart3,
    LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userDataContext } from '../../Context/UserContext';

const TeacherProfile = ({ onBack }) => {
    const { user, TeacherSignOut } = useContext(userDataContext);

    // Load initial profile from localStorage if available, else defaults
    const [profileData, setProfileData] = useState(() => {
        const savedProfile = localStorage.getItem('teacherProfile');
        return savedProfile
            ? JSON.parse(savedProfile)
            : {
                name: user?.name || 'Teacher Name',
                email: user?.email || 'teacher@example.com',
                school: 'Green Valley Elementary',
                subject: 'Environmental Science',
                experience: '5 years',
                bio: 'Passionate environmental educator dedicated to inspiring the next generation of eco-warriors.',
                phone: '+1 (555) 123-4567',
                location: 'San Francisco, CA',
            };
    });

    const [isEditing, setIsEditing] = useState(false);

    // Save to localStorage whenever profileData changes
    useEffect(() => {
        localStorage.setItem('teacherProfile', JSON.stringify(profileData));
    }, [profileData]);

    const handleSaveProfile = () => {
        setIsEditing(false);
        toast.success('✅ Profile updated successfully!');
    };

    const handleSignOut = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            TeacherSignOut();
            toast.success('Signed out successfully');
        }
    };

    const teachingStats = {
        totalLessons: 25,
        totalQuizzes: 18,
        totalStudents: 142,
        averageScore: 87,
        lessonsThisMonth: 8,
        activeStudents: 128,
    };

    const recentAchievements = [
        { icon: '🏆', title: 'Top Educator', description: 'Highest student engagement this quarter' },
        { icon: '🌟', title: 'Innovation Award', description: 'Creative lesson design recognition' },
        { icon: '📚', title: 'Content Creator', description: '25+ lessons published' },
        { icon: '👥', title: 'Student Mentor', description: '100+ students guided' },
    ];

    return (
        <div className="min-h-screen bg-[#fafaff] p-6">
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
                            className="mr-4 p-2 rounded-md bg-white shadow-lg transition-transform"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 font-fredoka">Teacher Profile</h1>
                            <p className="text-black font-light">Manage your professional information</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        <LogOut size={20} className="mr-2" />
                        Sign Out
                    </button>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 flex flex-col gap-3 space-y-6">
                        {/* Basic Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-md shadow-lg p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    Personal Information
                                </h2>

                                <button
                                    onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                                    className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                >
                                    {isEditing ? <Save size={16} className="mr-2" /> : <Edit size={16} className="mr-2" />}
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Full Name', key: 'name', icon: <User size={16} className="mr-2 text-gray-500" />, type: 'text' },
                                    { label: 'Email', key: 'email', icon: <Mail size={16} className="mr-2 text-gray-500" />, type: 'text', readOnly: true },
                                    { label: 'School', key: 'school', icon: <School size={16} className="mr-2 text-gray-500" />, type: 'text' },
                                    { label: 'Subject', key: 'subject', icon: null, type: 'text' },
                                    { label: 'Experience', key: 'experience', icon: <Calendar size={16} className="mr-2 text-gray-500" />, type: 'text' },
                                    { label: 'Phone', key: 'phone', icon: null, type: 'tel' },
                                    { label: 'Bio', key: 'bio', icon: null, type: 'textarea', colSpan: 2 },
                                ].map((field) => (
                                    <div key={field.key} className={field.colSpan ? `md:col-span-2` : ''}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                                        {isEditing && !field.readOnly ? (
                                            field.type === 'textarea' ? (
                                                <textarea
                                                    value={profileData[field.key]}
                                                    onChange={(e) =>
                                                        setProfileData({ ...profileData, [field.key]: e.target.value })
                                                    }
                                                    rows={3}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    value={profileData[field.key]}
                                                    onChange={(e) =>
                                                        setProfileData({ ...profileData, [field.key]: e.target.value })
                                                    }
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            )
                                        ) : (
                                            <p className="p-3 bg-gray-50 rounded-lg text-gray-800 flex items-center">
                                                {field.icon} {profileData[field.key]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Teaching Statistics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-md shadow-lg p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <BarChart3 size={20} className="text-green-600" />
                                </div>
                                Teaching Statistics
                            </h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <BookOpen className="mx-auto text-green-600 mb-2" size={32} />
                                    <div className="text-2xl font-bold text-green-600">{teachingStats.totalLessons}</div>
                                    <div className="text-sm text-gray-600">Total Lessons</div>
                                </div>

                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <Award className="mx-auto text-green-600 mb-2" size={32} />
                                    <div className="text-2xl font-bold text-green-600">{teachingStats.totalQuizzes}</div>
                                    <div className="text-sm text-gray-600">Total Quizzes</div>
                                </div>

                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <Users className="mx-auto text-green-600 mb-2" size={32} />
                                    <div className="text-2xl font-bold text-green-600">{teachingStats.totalStudents}</div>
                                    <div className="text-sm text-gray-600">Total Students</div>
                                </div>

                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <BarChart3 className="mx-auto text-green-600 mb-2" size={32} />
                                    <div className="text-2xl font-bold text-green-600">{teachingStats.averageScore}%</div>
                                    <div className="text-sm text-gray-600">Avg. Score</div>
                                </div>

                                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                                    <Calendar className="mx-auto text-green-600 mb-2" size={32} />
                                    <div className="text-2xl font-bold text-green-600">{teachingStats.lessonsThisMonth}</div>
                                    <div className="text-sm text-gray-600">This Month</div>
                                </div>

                                <div className="text-center p-4 bg-pink-50 rounded-lg">
                                    <Users className="mx-auto text-green-600 mb-2" size={32} />
                                    <div className="text-2xl font-bold text-green-600">{teachingStats.activeStudents}</div>
                                    <div className="text-sm text-gray-600">Active Students</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 flex flex-col gap-3">
                        {/* Profile Avatar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-md shadow-lg p-6 text-center"
                        >
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-white text-3xl font-bold">{profileData.name.charAt(0)}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{profileData.name}</h3>
                            <p className="text-gray-600">{profileData.subject}</p>
                            <p className="text-sm text-gray-500">{profileData.school}</p>
                        </motion.div>

                        {/* Achievements */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-md shadow-lg p-6"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Achievements</h3>
                            <div className="space-y-3">
                                {recentAchievements.map((achievement, index) => (
                                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-2xl mr-3">{achievement.icon}</span>
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">{achievement.title}</div>
                                            <div className="text-xs text-gray-600">{achievement.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-md shadow-lg p-6"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                    <div className="text-sm font-medium text-blue-800">Create New Lesson</div>
                                    <div className="text-xs text-blue-600">Add educational content</div>
                                </button>

                                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                                    <div className="text-sm font-medium text-purple-800">Design Quiz</div>
                                    <div className="text-xs text-purple-600">Test student knowledge</div>
                                </button>

                                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                                    <div className="text-sm font-medium text-green-800">View Reports</div>
                                    <div className="text-xs text-green-600">Check student progress</div>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
