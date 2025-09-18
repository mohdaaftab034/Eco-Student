import React, { useState, useEffect } from 'react'
// import { useAdminAuth } from '../hooks/useAdminAuth'
// import { useAuth } from '../hooks/useAuth'
// import { lumi } from '../lib/lumi'
import {
    Users, BookOpen, Award, TrendingUp, Shield, Activity,
    Settings, Search, Filter, Download, AlertCircle,
    CheckCircle, Clock, XCircle, LogOut
} from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import { useContext } from 'react'
import { userDataContext } from '../Context/UserContext'

const AdminDashboard = () => {
    const { adminUser, isAdmin, loading, hasPermission, logActivity } = useContext(userDataContext)
    const { signOut } = useContext(userDataContext)
    const [activeTab, setActiveTab] = useState('overview')
    const [analytics, setAnalytics] = useState(null)
    const [users, setUsers] = useState([])
    const [pendingApprovals, setPendingApprovals] = useState([])
    const [activityLogs, setActivityLogs] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')

    // Logout handler
    const handleLogout = async () => {
        try {
            await logActivity('admin_logout', 'auth', adminUser?.user_id || '', {
                role: adminUser?.role,
                logout_time: new Date().toISOString()
            })

            await signOut()
            toast.success('Logged out successfully')

            setTimeout(() => {
                window.location.href = '/admin/login'
            }, 1000)
        } catch (error) {
            console.error('Logout failed:', error)
            toast.error('Logout failed')
        }
    }

    // Fetch analytics data
    const fetchAnalytics = async () => {
        try {
            const { list: analyticsData } = await lumi.entities.system_analytics.list({
                sort: { date: -1 },
                limit: 1
            })

            if (analyticsData && analyticsData.length > 0) {
                const latest = analyticsData[0]
                setAnalytics({
                    totalUsers: latest.metric_type === 'total_users' ? latest.value : 0,
                    lessonsCompleted: 0,
                    ecoPointsEarned: 0,
                    badgesUnlocked: 0,
                    dailyActiveUsers: 0,
                    contentCreated: 0
                })

                const metrics = await Promise.all([
                    lumi.entities.system_analytics.list({ filter: { metric_type: 'total_users' }, sort: { date: -1 }, limit: 1 }),
                    lumi.entities.system_analytics.list({ filter: { metric_type: 'lessons_completed' }, sort: { date: -1 }, limit: 1 }),
                    lumi.entities.system_analytics.list({ filter: { metric_type: 'eco_points_earned' }, sort: { date: -1 }, limit: 1 }),
                    lumi.entities.system_analytics.list({ filter: { metric_type: 'badges_unlocked' }, sort: { date: -1 }, limit: 1 })
                ])

                setAnalytics({
                    totalUsers: metrics[0].list?.[0]?.value || 1250,
                    lessonsCompleted: metrics[1].list?.[0]?.value || 3420,
                    ecoPointsEarned: metrics[2].list?.[0]?.value || 125000,
                    badgesUnlocked: metrics[3].list?.[0]?.value || 890,
                    dailyActiveUsers: 850,
                    contentCreated: 245
                })
            } else {
                setAnalytics({
                    totalUsers: 1250,
                    lessonsCompleted: 3420,
                    ecoPointsEarned: 125000,
                    badgesUnlocked: 890,
                    dailyActiveUsers: 850,
                    contentCreated: 245
                })
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
            setAnalytics({
                totalUsers: 1250,
                lessonsCompleted: 3420,
                ecoPointsEarned: 125000,
                badgesUnlocked: 890,
                dailyActiveUsers: 850,
                contentCreated: 245
            })
        }
    }

    // Fetch users data
    const fetchUsers = async () => {
        try {
            const { list: allUsers } = await lumi.entities.admin_users.list({
                sort: { created_at: -1 }
            })

            setUsers(allUsers || [])
            setPendingApprovals((allUsers || []).filter(user => user.status === 'pending'))
        } catch (error) {
            console.error('Failed to fetch users:', error)
        }
    }

    // Fetch activity logs
    const fetchActivityLogs = async () => {
        try {
            const { list: logs } = await lumi.entities.activity_logs.list({
                sort: { timestamp: -1 },
                limit: 50
            })
            setActivityLogs(logs || [])
        } catch (error) {
            console.error('Failed to fetch activity logs:', error)
        }
    }

    // Approve/Reject user
    const handleUserApproval = async (userId, action) => {
        if (!hasPermission('manage_users')) {
            toast.error('You do not have permission to manage users')
            return
        }

        try {
            const status = action === 'approve' ? 'approved' : 'rejected'
            await lumi.entities.admin_users.update(userId, {
                status,
                approved_by: adminUser?.user_id,
                approval_date: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })

            await logActivity('user_' + action + 'd', 'admin_user', userId, {
                action,
                approved_by: adminUser?.user_id
            })

            toast.success(`User ${action}d successfully`)
            fetchUsers()
        } catch (error) {
            console.error(`Failed to ${action} user:`, error)
            toast.error(`Failed to ${action} user`)
        }
    }

    // Change user role
    const handleRoleChange = async (userId, newRole) => {
        if (!hasPermission('manage_roles')) {
            toast.error('You do not have permission to manage roles')
            return
        }

        try {
            await lumi.entities.admin_users.update(userId, {
                role: newRole,
                updated_at: new Date().toISOString()
            })

            await logActivity('role_changed', 'admin_user', userId, {
                new_role: newRole,
                changed_by: adminUser?.user_id
            })

            toast.success('User role updated successfully')
            fetchUsers()
        } catch (error) {
            console.error('Failed to update user role:', error)
            toast.error('Failed to update user role')
        }
    }

    useEffect(() => {
        if (isAdmin) {
            fetchAnalytics()
            fetchUsers()
            fetchActivityLogs()
        }
    }, [isAdmin])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
                    <p className="text-lg text-gray-600">Loading Admin Panel...</p>
                </div>
            </div>
        )
    }

    // if (!isAdmin) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
    //             <div className="text-center max-w-md mx-auto p-8">
    //                 <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
    //                 <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
    //                 <p className="text-gray-600 mb-6">
    //                     You do not have administrator privileges to access this panel.
    //                     Please contact a system administrator if you believe this is an error.
    //                 </p>
    //                 <button
    //                     onClick={() => window.location.href = '/admin/login'}
    //                     className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
    //                 >
    //                     Go to Admin Login
    //                 </button>
    //             </div>
    //         </div>
    //     )
    // }

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchTerm ||
            user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.userName && user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesRole = filterRole === 'all' || user.role === filterRole
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus

        return matchesSearch && matchesRole && matchesStatus
    })

    const chartData = [
        { name: 'Students', value: analytics?.totalUsers ? Math.floor(analytics.totalUsers * 0.8) : 1000, color: '#10b981' },
        { name: 'Teachers', value: analytics?.totalUsers ? Math.floor(analytics.totalUsers * 0.15) : 187, color: '#3b82f6' },
        { name: 'NGOs', value: analytics?.totalUsers ? Math.floor(analytics.totalUsers * 0.04) : 50, color: '#f59e0b' },
        { name: 'Admins', value: analytics?.totalUsers ? Math.floor(analytics.totalUsers * 0.01) : 13, color: '#ef4444' }
    ]

    return !isAdmin && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-lg border-b border-green-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Shield className="w-8 h-8 text-green-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-800">EcoLearn Admin</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome, {adminUser?.role.replace('_', ' ').toUpperCase()}
                            </span>
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    {adminUser?.user_id.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: TrendingUp },
                            { id: 'users', label: 'User Management', icon: Users },
                            { id: 'content', label: 'Content Management', icon: BookOpen },
                            { id: 'analytics', label: 'Analytics', icon: BarChart },
                            { id: 'activity', label: 'Activity Logs', icon: Activity },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map(tab => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                                <div className="flex items-center">
                                    <Users className="w-8 h-8 text-green-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalUsers.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                                <div className="flex items-center">
                                    <BookOpen className="w-8 h-8 text-blue-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
                                        <p className="text-2xl font-bold text-gray-900">{analytics?.lessonsCompleted.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                                <div className="flex items-center">
                                    <Award className="w-8 h-8 text-yellow-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Eco Points Earned</p>
                                        <p className="text-2xl font-bold text-gray-900">{analytics?.ecoPointsEarned.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                                <div className="flex items-center">
                                    <TrendingUp className="w-8 h-8 text-purple-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Badges Unlocked</p>
                                        <p className="text-2xl font-bold text-gray-900">{analytics?.badgesUnlocked.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* User Distribution */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Pending Approvals */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Approvals</h3>
                                <div className="space-y-3">
                                    {pendingApprovals.slice(0, 5).map(user => (
                                        <div key={user._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">{user.user_id}</p>
                                                <p className="text-sm text-gray-600">Role: {user.role}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleUserApproval(user._id, 'approve')}
                                                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUserApproval(user._id, 'reject')}
                                                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingApprovals.length === 0 && (
                                        <p className="text-gray-500 text-center py-4">No pending approvals</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Management Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="ngo">NGO</option>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>

                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>

                                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                    <Download className="w-4 h-4" />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map(user => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{user.user_id}</div>
                                                        <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {hasPermission('manage_roles') ? (
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                            className="text-sm border border-gray-300 rounded px-2 py-1"
                                                        >
                                                            <option value="student">Student</option>
                                                            <option value="teacher">Teacher</option>
                                                            <option value="ngo">NGO</option>
                                                            <option value="coordinator">Coordinator</option>
                                                            <option value="admin">Admin</option>
                                                            {adminUser?.role === 'super_admin' && (
                                                                <option value="super_admin">Super Admin</option>
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <span className="text-sm text-gray-900">{user.role}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            user.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {user.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                        {user.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                                        {user.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.last_login ? format(new Date(user.last_login), 'MMM dd, yyyy HH:mm') : 'Never'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {user.status === 'pending' && hasPermission('manage_users') && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUserApproval(user._id, 'approve')}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUserApproval(user._id, 'reject')}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Activity Logs Tab */}
                {activeTab === 'activity' && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {activityLogs.map(log => (
                                        <tr key={log._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.entity_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {log.details && typeof log.details === 'object' ?
                                                    Object.entries(log.details).map(([key, value]) => (
                                                        <span key={key} className="block">{key}: {String(value)}</span>
                                                    )) :
                                                    String(log.details || 'No details')
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Placeholder for other tabs */}
                {activeTab === 'content' && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Content Management</h3>
                        <p className="text-gray-600">Manage lessons, quizzes, and campaigns from this section.</p>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Analytics</h3>
                        <p className="text-gray-600">Detailed analytics and reporting tools will be available here.</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">System Settings</h3>
                        <p className="text-gray-600">Configure system-wide settings and preferences.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}

export default AdminDashboard
