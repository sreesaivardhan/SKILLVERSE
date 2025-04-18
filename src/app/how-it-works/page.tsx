'use client';

import Image from 'next/image';
import { 
  FiClock, FiUsers, FiAward, FiBook, FiCheckCircle, FiCheck, 
  FiArrowUp, FiArrowDown, FiGift, FiVideo, FiCalendar, FiMessageSquare 
} from 'react-icons/fi';

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How SkillVerse Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SkillVerse connects skilled individuals with those eager to learn, creating a community where knowledge is shared and valued through our time-credit system.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64">
              <Image
                src="/teaching.jpg"
                alt="Teaching on SkillVerse"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-purple-600/70 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold text-center px-4">
                  Teach & Earn
                </h2>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Share Your Expertise</h3>
              <p className="text-gray-600 mb-4">
                Verify your skills, set your availability, and start teaching others. 
                Every hour you teach earns you time credits to spend on learning new skills.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <FiCheck className="h-3 w-3 text-green-600" />
                  </span>
                  <span>Teach skills you're passionate about</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <FiCheck className="h-3 w-3 text-green-600" />
                  </span>
                  <span>Set your own schedule and rates</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <FiCheck className="h-3 w-3 text-green-600" />
                  </span>
                  <span>Build your reputation with reviews</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64">
              <Image
                src="/learning.jpg"
                alt="Learning on SkillVerse"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/70 to-teal-600/70 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold text-center px-4">
                  Learn & Grow
                </h2>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Acquire New Skills</h3>
              <p className="text-gray-600 mb-4">
                Browse our marketplace of verified instructors, book sessions using your time credits, 
                and learn new skills through personalized, one-on-one instruction.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <FiCheck className="h-3 w-3 text-green-600" />
                  </span>
                  <span>Find experts in hundreds of skills</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <FiCheck className="h-3 w-3 text-green-600" />
                  </span>
                  <span>Learn at your own pace and schedule</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <FiCheck className="h-3 w-3 text-green-600" />
                  </span>
                  <span>Connect via our integrated video platform</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
          
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold mb-4">The SkillVerse Journey</h3>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FiUsers className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">1. Join Our Community</h4>
                  <p className="text-gray-600">
                    Create an account, complete your profile, and list your skills. Whether you're here to learn, 
                    teach, or both, you'll find a welcoming community of skill-sharers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <FiAward className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">2. Verify Your Expertise</h4>
                  <p className="text-gray-600">
                    To become an instructor, you'll need to verify your expertise through our assessment process. 
                    This ensures high-quality instruction and builds trust within our community.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <FiClock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">3. Understand Time Credits</h4>
                  <p className="text-gray-600">
                    Time credits are our platform's currency. You earn them by teaching and spend them by learning. 
                    One hour of teaching equals one time credit, which can be used for one hour of learning.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <FiBook className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">4. Book Sessions & Learn</h4>
                  <p className="text-gray-600">
                    Browse our marketplace to find instructors that match your learning needs. 
                    Book sessions using your time credits and connect via our integrated video platform.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <FiCheckCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">5. Rate & Review</h4>
                  <p className="text-gray-600">
                    After each session, provide feedback to help maintain quality and help others find the best instructors. 
                    Your ratings contribute to our community's growth and excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Time Credits System */}
        <div className="bg-indigo-50 rounded-lg p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              <FiClock className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Time Credit System</h2>
              <p className="text-lg text-gray-700">
                Our unique currency that powers the SkillVerse economy. Earn by teaching, spend by learning.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Earning Credits</h3>
              <p className="text-gray-600 mb-4">
                Teach your verified skills to others and earn time credits. One hour of teaching equals one time credit.
              </p>
              <div className="flex items-center text-indigo-600">
                <FiArrowUp className="mr-2 h-5 w-5" />
                <span className="font-medium">1 hour teaching = 1 credit</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Spending Credits</h3>
              <p className="text-gray-600 mb-4">
                Use your earned credits to book sessions with other instructors and learn new skills.
              </p>
              <div className="flex items-center text-indigo-600">
                <FiArrowDown className="mr-2 h-5 w-5" />
                <span className="font-medium">1 credit = 1 hour learning</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
              <p className="text-gray-600 mb-4">
                New users receive 2 time credits upon registration to help you start your learning journey.
              </p>
              <div className="flex items-center text-indigo-600">
                <FiGift className="mr-2 h-5 w-5" />
                <span className="font-medium">New users get 2 free credits</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Platform Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <FiVideo className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Integrated Video</h3>
              <p className="text-gray-600">
                Connect seamlessly with our built-in video conferencing platform.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">
                Set your availability and let our system match you with compatible sessions.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FiAward className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Skill Verification</h3>
              <p className="text-gray-600">
                Our assessment system ensures high-quality instruction from verified experts.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Messaging System</h3>
              <p className="text-gray-600">
                Communicate with instructors or learners before and after sessions.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-2">How do I earn my first time credits?</h4>
                <p className="text-gray-600">
                  New users receive 2 time credits upon registration to help you get started. You can earn more by 
                  teaching others your verified skills.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2">What happens during a skill verification?</h4>
                <p className="text-gray-600">
                  Our verification process includes a combination of credential review, skill assessment, and a 
                  brief interview with one of our moderators to ensure quality instruction.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2">Can I teach and learn at the same time?</h4>
                <p className="text-gray-600">
                  Absolutely! Many of our users are both instructors and learners. This creates a vibrant 
                  community where everyone can contribute and benefit.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2">What if I need to cancel a session?</h4>
                <p className="text-gray-600">
                  Sessions can be canceled up to 24 hours in advance without penalty. Late cancellations may 
                  result in the deduction of time credits to respect everyone's time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
