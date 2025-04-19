'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiClock, FiUsers, FiAward, FiMessageSquare, FiSearch, FiLogIn } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { isAuthenticated, subscribeToAuth, getAuthState } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const [authState, setAuthState] = useState({ isAuthenticated: false, loading: true });
  
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuth((state: any) => {
      setAuthState({
        isAuthenticated: state.isAuthenticated,
        loading: state.loading
      });
    });
    
    // Initial auth check
    const currentState = getAuthState();
    setAuthState({
      isAuthenticated: currentState.isAuthenticated,
      loading: currentState.loading
    });
    
    return () => {
      // Cleanup subscription on unmount
      unsubscribe();
    };
  }, []);
  
  // Redirect authenticated users to dashboard if they access the home page
  useEffect(() => {
    if (authState.isAuthenticated && !authState.loading) {
      router.push('/dashboard');
    }
  }, [authState.isAuthenticated, authState.loading, router]);
  
  // Show loading state
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // If user is authenticated, they'll be redirected, but we'll show a loading state
  if (authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-3 text-gray-600">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/skillverse-logo.png" 
                alt="Skillverse Logo" 
                width={140} 
                height={36} 
                className="h-9 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              <Link href="/skills" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Explore Skills</Link>
              <Link href="/how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</Link>
              <Link href="/community" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community</Link>
              <Link href="/login" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-md hover:from-blue-700 hover:to-cyan-500 transition-all shadow-sm">Login / Sign Up</Link>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Open menu">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Welcome to <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Skillverse</span>
                <br />
                <span className="text-2xl sm:text-3xl font-medium text-gray-600 dark:text-gray-400">
                  Trade Time, Not Money
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                Learn new skills, teach what you know, and grow with a global community – all powered by time credits and AI matchmaking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register" className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-md hover:from-cyan-500 hover:to-blue-700 transition-all shadow-md flex items-center justify-center">
                  Join the Skillverse <FiArrowRight className="ml-2" />
                </Link>
                <Link href="/skills" className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center">
                  Explore Skills <FiSearch className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <Image
                  src="/skill-exchange-illustration.svg"
                  alt="People exchanging skills"
                  width={500}
                  height={500}
                  className="object-contain"
                  priority
                />
                <div className="absolute -bottom-6 right-0 w-32 h-32 md:w-40 md:h-40">
                  <Image
                    src="/skillverse-logo.png"
                    alt="Skillverse Logo"
                    width={160}
                    height={160}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Skillverse?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Our platform is designed to make skill exchange seamless, rewarding, and accessible to everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiClock className="w-8 h-8 text-cyan-500" />,
                title: "Time-Credit Banking",
                description: "Earn credits by teaching and spend them to learn new skills from others."
              },
              {
                icon: <FiSearch className="w-8 h-8 text-blue-600" />,
                title: "AI-Powered Matching",
                description: "Our smart algorithms connect you with ideal skill partners based on your goals and availability."
              },
              {
                icon: <FiUsers className="w-8 h-8 text-green-600" />,
                title: "Verified Community",
                description: "All skills and instructors are carefully vetted to ensure quality learning experiences."
              },
              {
                icon: <FiMessageSquare className="w-8 h-8 text-yellow-600" />,
                title: "Real-Time Chat",
                description: "Communicate securely within our platform before, during, and after sessions."
              },
              {
                icon: <FiAward className="w-8 h-8 text-red-600" />,
                title: "Skill Certification",
                description: "Earn verifiable credentials that showcase your expertise to the community."
              },
              {
                icon: <FiCheck className="w-8 h-8 text-indigo-600" />,
                title: "Flexible Scheduling",
                description: "Book sessions that fit your calendar with our intuitive scheduling system."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-all border border-gray-100 dark:border-gray-600">
                <div className="w-12 h-12 bg-blue-50 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">How Skillverse Works</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Start your skill exchange journey in just four simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Profile",
                description: "List your skills and learning goals to get personalized matches"
              },
              {
                step: "2",
                title: "Find Matches",
                description: "Search manually or let our AI recommend perfect skill partners"
              },
              {
                step: "3",
                title: "Book Sessions",
                description: "Schedule 1:1 or group learning sessions that fit your calendar"
              },
              {
                step: "4",
                title: "Exchange Skills",
                description: "Learn, teach, and earn time credits to spend on new skills"
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-md">
                  {item.step}
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600" />
                )}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* AI Recommendation Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-4">AI Skill Recommendations</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Not sure where to start? Our AI analyzes your interests, experience, and goals to suggest the perfect skills to learn or teach.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-md hover:from-cyan-500 hover:to-blue-700 transition-all flex items-center shadow-md">
                  Try Skill AI Now <FiArrowRight className="ml-2" />
                </button>
              </div>
              <div className="lg:w-1/2">
                <div className="relative w-full aspect-video bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-600">
                  <Image
                    src="/ai-recommendation.jpg"
                    alt="AI Recommendation Interface"
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 px-4 py-2 rounded text-white font-medium">
                      AI Recommendation Interface
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Community Says</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Join thousands of members who are already exchanging skills on our platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Web Developer",
                quote: "I earned enough credits teaching JavaScript to learn UX design - all without spending money! The platform made the entire process so seamless.",
                image: "/avatars/alex.jpg"
              },
              {
                name: "Maria Chen",
                role: "Graphic Designer",
                quote: "The quality of instructors on Skillverse is amazing. I've leveled up my skills dramatically and made great connections in the industry.",
                image: "/avatars/maria.jpg"
              },
              {
                name: "Sam Wilson",
                role: "Data Scientist",
                quote: "The time-credit system is genius. I've learned Python, SQL, and machine learning by teaching math. It's truly a win-win exchange.",
                image: "/avatars/sam.jpg"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-cyan-400 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Verified Skills" },
              { number: "1.2K+", label: "Active Members" },
              { number: "3K+", label: "Hours Exchanged" },
              { number: "100+", label: "Countries" }
            ].map((stat, index) => (
              <div key={index} className="p-4 rounded-lg backdrop-blur-sm bg-white/10">
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Skill Revolution?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Start your skill exchange journey today. No money needed - just your time and knowledge.
          </p>
          <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-md hover:from-cyan-500 hover:to-blue-700 transition-all inline-flex items-center text-lg shadow-md">
            Get Started - It's Free <FiArrowRight className="ml-2" />
          </Link>
          <p className="mt-4 text-gray-500 dark:text-gray-400">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <div className="mb-4">
                <Image 
                  src="/skillverse-logo.png" 
                  alt="Skillverse Logo" 
                  width={120} 
                  height={40} 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                The peer-to-peer skill exchange platform where time is currency.
              </p>
              <div className="flex space-x-4 mt-4">
                <Link href="#" aria-label="Twitter" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" aria-label="GitHub" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.183 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" aria-label="LinkedIn" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
                <Link href="#" aria-label="Instagram" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="md:col-span-3">
              <h4 className="font-medium mb-4 text-lg">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/skills" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Explore Skills</Link></li>
                <li><Link href="/how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Pricing</Link></li>
                <li><Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <h4 className="font-medium mb-4 text-lg">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <h4 className="font-medium mb-4 text-lg">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/guidelines" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Community Guidelines</Link></li>
                <li><Link href="/accessibility" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Skillverse. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/accessibility" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 text-sm">Accessibility</Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link href="/sitemap" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 text-sm">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
