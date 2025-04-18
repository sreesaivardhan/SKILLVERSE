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
                      src="/hero-image.jpg" 
                      alt="SKILLVERSE community" 
                      width={600} 
                      height={400}
                      className="w-full h-auto object-cover"
                      priority
                    />
                    <div className="p-6 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <FiUsers className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Join our growing community</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">5,000+ active members</p>
                        </div>
                      </div>
                    </div>
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
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform connects skilled instructors with eager learners through a time credit system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <Image 
                  src="/skill-teaching.jpg" 
                  alt="Verified Skills" 
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/70 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <FiAward className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Skills</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All instructors pass qualifying exams to verify their expertise before teaching others
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <Image 
                  src="/time-credits.jpg" 
                  alt="Time Credit System" 
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/70 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <FiClock className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Credit System</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn credits by teaching, spend them to learn new skills from others
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <Image 
                  src="/ai-matching.jpg" 
                  alt="AI Matching" 
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/70 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                    <FiUsers className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Matching</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI helps you find the perfect instructor based on your learning goals and preferences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start sharing your skills or learning from others today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/register">
                  Sign Up Now
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/marketplace">
                  Browse Skills
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Skills</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover trending skills you can learn or teach on SKILLVERSE
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="relative h-40 rounded-xl overflow-hidden group">
              <Image 
                src="/coding-workshop.jpg" 
                alt="Web Development" 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <span className="text-white font-medium">Web Development</span>
              </div>
            </div>
            <div className="relative h-40 rounded-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-medium text-lg">Digital Marketing</span>
              </div>
            </div>
            <div className="relative h-40 rounded-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-medium text-lg">Data Science</span>
              </div>
            </div>
            <div className="relative h-40 rounded-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-medium text-lg">Graphic Design</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear from people who have experienced the SKILLVERSE difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                  JS
                </div>
                <div>
                  <h4 className="font-semibold">John Smith</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Web Developer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "I've been able to improve my coding skills significantly by learning from experienced developers. The time credit system makes it affordable and sustainable."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
                  AR
                </div>
                <div>
                  <h4 className="font-semibold">Amanda Rodriguez</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Graphic Designer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "Teaching others has not only earned me credits but also helped me refine my own skills. The verification process ensures everyone is qualified to teach."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
                  DK
                </div>
                <div>
                  <h4 className="font-semibold">David Kim</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Specialist</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "The AI matching system connected me with the perfect instructor for my needs. I've learned more in a few sessions than I did in months of self-study."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
