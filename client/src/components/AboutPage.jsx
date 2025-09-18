
import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
// import LocomotiveScroll from "locomotive-scroll";
import { Leaf, Users, Award, BookOpen, Target, Heart, Globe, Lightbulb, Star, ArrowRight, CheckCircle, TreePine, Recycle, Droplets } from 'lucide-react'
import Footer from './Footer'
import { useNavigate } from 'react-router-dom'
// import '../../src/locomotive-scroll.css'

const AboutPage = () => {
    const navigate = useNavigate();
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }


    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const features = [
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Interactive Lessons",
            description: "Engaging environmental education content designed for young minds"
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Gamification",
            description: "Earn badges, points, and rewards while learning about sustainability"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community Learning",
            description: "Connect with teachers, students, and NGOs in a collaborative environment"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Real Impact",
            description: "Track your environmental contributions and see real-world results"
        }
    ]

    const teamMembers = [
        {
            name: "Dr. Sarah Green",
            role: "Environmental Education Specialist",
            image: "https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            bio: "15+ years in environmental education and curriculum development"
        },
        {
            name: "Alex Chen",
            role: "Technology Lead",
            image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            bio: "Expert in educational technology and gamification systems"
        },
        {
            name: "Maria Rodriguez",
            role: "Community Outreach Director",
            image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            bio: "Connecting schools, NGOs, and communities for environmental action"
        },
        {
            name: "David Park",
            role: "UX/UI Designer",
            image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            bio: "Creating intuitive and engaging learning experiences for children"
        }
    ]

    const stats = [
        { number: "50,000+", label: "Students Engaged", icon: <Users className="w-6 h-6" /> },
        { number: "1,200+", label: "Teachers Participating", icon: <BookOpen className="w-6 h-6" /> },
        { number: "150+", label: "NGO Partners", icon: <Heart className="w-6 h-6" /> },
        { number: "25+", label: "Countries Reached", icon: <Globe className="w-6 h-6" /> }
    ]

    const achievements = [
        "Winner of the 2023 Global Education Innovation Award",
        "Featured in UNESCO's Digital Learning Report",
        "Certified B-Corp for Environmental Impact",
        "Partnership with 15+ International Environmental Organizations"
    ]

    return (


        <div className="min-h-screen bg-[#fafaff]">
            <div className="flex z-50 fixed top-5 left-10 items-center justify-center mb-6">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="bg-emerald-400 p-4 rounded-full mr-4"
                >
                    <Leaf className="text-white" size={20} />
                </motion.div>
                <h1 className="text-3xl font-bold bg-emerald-800 bg-clip-text text-transparent font-fredoka">
                    EcoLearn
                </h1>
            </div>

            <button onClick={() => navigate('/page')} className="fixed top-5 right-5 bg-gradient-to-r cursor-pointer from-emerald-600 to-emerald-600 text-white px-2 z-50 py-2 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                Join Our Mission <ArrowRight className="w-5 h-5" />
            </button>
            {/* Hero Section */}
            <motion.section
                className="relative py-20 px-4 overflow-hidden"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
                <div className="absolute top-10 left-10 text-green-200 opacity-50">
                    <TreePine className="w-32 h-32" />
                </div>
                <div className="absolute bottom-10 right-10 text-blue-200 opacity-50">
                    <Droplets className="w-24 h-24" />
                </div>
                <div className="absolute top-1/2 left-1/4 text-emerald-200 opacity-30">
                    <Recycle className="w-20 h-20" />
                </div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Leaf className="w-4 h-4" />
                            About EcoLearn
                        </div>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight"
                    >
                        Nurturing Future
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                            {" "}Environmental Leaders
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-xl md:text-2xl text-black font-light mb-8 max-w-4xl mx-auto leading-relaxed"
                    >
                        EcoLearn is revolutionizing environmental education through gamification,
                        community engagement, and real-world impact. We're building a generation
                        of environmentally conscious leaders who will shape our planet's future.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => navigate('/page')} className="bg-gradient-to-r cursor-pointer from-emerald-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                            Join Our Mission <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="bg-white cursor-pointer text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-green-300 transition-all duration-300">
                            Learn More
                        </button>
                    </motion.div>
                </div>
            </motion.section>

            {/* Mission Section */}
            <motion.section
                className="py-20 px-4"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div variants={fadeInUp}>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                                Our Mission
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                We believe that environmental education should be engaging, accessible,
                                and impactful. Our platform combines cutting-edge technology with
                                proven educational methodologies to create an immersive learning
                                experience that inspires action.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Through gamification, community collaboration, and real-world projects,
                                we're empowering students, teachers, and NGOs to work together towards
                                a more sustainable future.
                            </p>
                            <div className="space-y-3">
                                {achievements.map((achievement, index) => (
                                    <motion.div
                                        key={index}
                                        variants={fadeInUp}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <span className="text-gray-700">{achievement}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="relative">
                            <div className="bg-[#fafaff] rounded-md shadow-lg p-8 relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-green-300 opacity-50">
                                    <Lightbulb className="w-16 h-16" />
                                </div>
                                <img
                                    src="https://static.vecteezy.com/system/resources/thumbnails/054/880/166/small_2x/thriving-tree-in-lush-green-environment-nature-conservation-and-protection-concept-free-photo.jpeg"
                                    alt="Students learning about environment"
                                    className="w-full h-64 object-cover transition-transform ease-in-out duration-300 hover:scale-105 rounded-xl mb-6"
                                />
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        Education Meets Action
                                    </h3>
                                    <p className="text-gray-600">
                                        Every lesson leads to real environmental impact
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                className="py-20 px-4 bg-white/50"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                            Why Choose EcoLearn?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our platform combines the best of education technology with environmental
                            science to create an unparalleled learning experience.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-[#fafaff] rounded-md p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
                            >
                                <div className="text-green-600 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Stats Section */}
            <motion.section
                className="py-20 px-4 bg-[#fafaff] ml-10 text-black mr-10 shadow-lg rounded-md"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2
                        variants={fadeInUp}
                        className="text-4xl md:text-5xl font-bold mb-16"
                    >
                        Our Global Impact
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white/10 shadow-lg rounded-md backdrop-blur-lg transition-transform duration-300 hover:scale-105 ease-out p-6 "
                            >
                                <div className=" mb-2">{stat.icon}</div>
                                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                                <div className="">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Team Section */}
            <motion.section
                className="py-20 px-4"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Meet Our Team
                        </h2>
                        <p className="text-xl text-black font-light max-w-3xl mx-auto">
                            Passionate educators, technologists, and environmental advocates
                            working together to transform education.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                                    <p className="text-green-600 font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm">{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div variants={fadeInUp}>
                        <Star className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                            Ready to Make a Difference?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of educators, students, and organizations who are
                            already creating positive environmental impact through EcoLearn.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button onClick={() => navigate('/page')} className="cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                Get Started Today
                            </button>
                            <button className="bg-white cursor-pointer text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-green-300 transition-all duration-300">
                                Contact Us
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </div>


    )
}

export default AboutPage
