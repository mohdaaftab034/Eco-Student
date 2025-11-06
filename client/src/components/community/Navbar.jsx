import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, User, PlusCircle, LogOut, Menu, X, Users } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const Navbar = () => {
    const { user, signIn, signOut } = useAuth()
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const isActive = (path) => location.pathname === path

    const navLinks = [
        { path: '/feed', label: 'Feed', icon: Home },
        { path: '/create', label: 'Create', icon: PlusCircle },
        { path: '/profile', label: 'Profile', icon: User }
    ]

    return (
        <nav className="bg-[#fafaff] shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div onClick={()=> navigate('/feed')}  className="flex items-center cursor-pointer">
                        <div className="bg-gradient-to-r hidden sm:flex text-black p-2 rounded-lg mr-3">
                            <Users className="text-black " size={24} />
                        </div>
                        <h1 className="text-2xl flex flex-col md:flex-row md:gap-2 font-bold text-gray-800 font-fredoka">EcoLearn <span className='text-green-800'>Community</span></h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-5 items-center space-x-8">
                        {isAuthenticated && (
                            <>
                                {navLinks.map(({ path, label, icon: Icon }) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        className={`flex items-center justify-center gap-2 space-x-1 px-8 py-2 rounded-md text-sm font-medium transition-colors ${isActive(path)
                                            ? 'bg-green-100 text-green-700'
                                            : 'text-gray-700 hover:text-green-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span>{label}</span>
                                    </Link>
                                ))}

                            </>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm hidden md:block text-gray-600">
                            Welcome, {user?.userName || 'User'}!
                        </span>
                        <button
                            onClick={signOut}
                            className="hidden md:block items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    {navLinks.map(({ path, label, icon: Icon }) => (
                                        <Link
                                            key={path}
                                            to={path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${isActive(path)
                                                ? 'bg-green-100 text-green-700'
                                                : 'text-gray-700 hover:text-green-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span>{label}</span>
                                        </Link>
                                    ))}

                                    <div className="px-3 py-2 text-sm text-gray-600">
                                        Welcome, {user?.userName || 'User'}!
                                    </div>

                                    <button
                                        onClick={() => {
                                            signOut()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        signIn()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
