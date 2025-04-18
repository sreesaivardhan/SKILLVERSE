import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiClock, FiUsers, FiAward } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 -z-10"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 -z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="block">Share Your Skills,</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Earn Time Credits</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                Join SKILLVERSE, a community where verified experts teach their skills and earn time credits. Learn from others, share your expertise, and grow together.  
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button variant="gradient" size="lg">
                  <Link href="/register" className="flex items-center">
                    Get Started <FiArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="/about" className="flex items-center">
                    How It Works
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <Image 
                      src="/images/hero-image.svg" 
                      alt="SKILLVERSE community" 
                      width={600} 
                      height={400}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SKILLVERSE Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform connects people who want to learn with those who want to teach, using time credits as currency.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-sm transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <FiUsers className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Skilled Instructors</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Browse through profiles of verified experts in various skills and fields.
              </p>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/images/skill-teaching.svg" 
                  alt="Find skilled instructors" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-sm transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
                <FiClock className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exchange Time Credits</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Earn credits by teaching and spend them to learn from others.
              </p>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/images/time-credits.svg" 
                  alt="Exchange time credits" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-sm transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                <FiAward className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow Your Skills</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Learn new skills through 1-on-1 sessions or group workshops.
              </p>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/images/coding-workshop.svg" 
                  alt="Grow your skills" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Matching Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/images/ai-matching.svg" 
                  alt="AI Matching" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Smart Skill Matching</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our AI-powered system matches you with the perfect instructor based on your learning goals, skill level, and preferences.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <FiCheck className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Personalized learning recommendations</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Find instructors with compatible teaching styles</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Discover skills that complement your existing ones</span>
                </li>
              </ul>
              <Button variant="gradient">
                <Link href="/register" className="flex items-center">
                  Try AI Matching <FiArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Hear from people who have used SKILLVERSE to learn new skills and share their expertise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Web Developer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "I've been teaching JavaScript on SKILLVERSE for 3 months and have earned enough credits to learn UX design. The platform is intuitive and the scheduling system works great!"
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">AS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Alice Smith</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Graphic Designer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The quality of instruction on SKILLVERSE is amazing. I learned Photoshop from a professional designer and now I'm teaching others about logo design. It's a win-win!"
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400 font-bold">MJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data Scientist</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "SKILLVERSE's time credit system is genius. I've been able to learn multiple skills without spending money, just by sharing my knowledge of Python and data analysis."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join SKILLVERSE?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Start learning new skills or sharing your expertise today. Join our community of lifelong learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/register" className="flex items-center">
                Create Account <FiArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
