
import React from 'react'
import { Heart, Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Recycle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-black text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand Section */}
                    <div className="space-y-4 flex flex-col gap-2">
                        <Link to="/student" className="flex items-center space-x-2">
                            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                <span className="hidden sm:inline">EcoLearn India</span>
                                <span className="sm:hidden">SW</span>
                            </span>
                        </Link>

                        <p className="text-sm leading-relaxed">
                            Empowering the next generation through gamified environmental education.
                            Learn, play, and make a difference for our planet.
                        </p>
                        <div className="flex space-x-4 gap-3">
                            <a href="https://www.facebook.com" className=" transition-colors duration-200">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="https://x.com" className=" transition-colors duration-200">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://www.instagram.com/accounts/login" className=" transition-colors duration-200">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="https://www.youtube.com" className=" transition-colors duration-200">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Quick Links</h4>
                        <ul className="space-y-2 flex flex-col gap-2">
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    About EcoLearn
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Environmental Lessons
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Interactive Quizzes
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Badges & Achievements
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors duration-200 text-sm">
                                    NGO Partners
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Teacher Resources
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Learning Resources */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Learning Hub</h4>
                        <ul className="space-y-2 flex flex-col gap-2">
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Climate Change
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Renewable Energy
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Wildlife Conservation
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Sustainable Living
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Ocean Protection
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" transition-colors duration-200 text-sm">
                                    Green Technology
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 flex flex-col gap-2">
                        <h4 className="text-lg font-semibold">Get in Touch</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 " />
                                <span className="text-green-100 text-sm">hello@ecolearn.org</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4" />
                                <span className="text-green-100 text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-4 w-4  mt-0.5" />
                                <span className=" text-sm">
                                    123 Green Street<br />
                                    Eco City, EC 12345
                                </span>
                            </div>
                        </div>

                        {/* Newsletter Signup */}
                        <div className="mt-6">
                            <h5 className="text-sm font-semibold mb-2">Stay Updated</h5>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-r-md transition-colors duration-200">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-green-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

                        {/* Copyright */}
                        <div className="flex items-center gap-2 space-x-2  text-sm">
                            <span>© 2025 EcoLearn. Made with</span>
                            <Heart className="h-4 w-4 text-red-400" />
                            <span>Team BugBusters.</span>
                        </div>

                        {/* Legal Links */}
                        <div className="flex items-center space-x-6 gap-2 text-sm">
                            <a href="#" className=" transition-colors duration-200">
                                Privacy Policy
                            </a>
                            <a href="#" className=" transition-colors duration-200">
                                Terms of Service
                            </a>
                            <a href="#" className=" transition-colors duration-200">
                                Cookie Policy
                            </a>
                            <a href="#" className=" transition-colors duration-200">
                                Accessibility
                            </a>
                        </div>

                        {/* Environmental Badge */}
                        <div className="flex items-center space-x-2  text-sm">
                            <Leaf className="h-4 w-4 text-green-400" />
                            <span>Carbon Neutral Platform</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
