"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiFilter, FiClock, FiStar, FiUsers, FiArrowRight } from "react-icons/fi";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Skill categories with their colors
const categories = [
  { name: "Technology", color: "blue" },
  { name: "Business", color: "purple" },
  { name: "Creative", color: "pink" },
  { name: "Lifestyle", color: "green" },
  { name: "Academic", color: "amber" },
  { name: "Languages", color: "indigo" },
  { name: "Professional", color: "rose" },
  { name: "Personal Development", color: "teal" },
];

// Trending skills data
const trendingSkills = [
  {
    id: 1,
    title: "Web Development with React",
    category: "Technology",
    image: "/coding-workshop.jpg",
    instructors: 12,
    rating: 4.8,
    timeCredits: 5,
    level: "Intermediate",
    trending: true,
    featured: true,
  },
  {
    id: 2,
    title: "Digital Marketing Fundamentals",
    category: "Business",
    image: "/skill-teaching.jpg",
    instructors: 8,
    rating: 4.7,
    timeCredits: 4,
    level: "Beginner",
    trending: true,
    featured: false,
  },
  {
    id: 3,
    title: "Data Science & Machine Learning",
    category: "Technology",
    image: "/ai-matching.jpg",
    instructors: 6,
    rating: 4.9,
    timeCredits: 6,
    level: "Advanced",
    trending: true,
    featured: true,
  },
  {
    id: 4,
    title: "Graphic Design Masterclass",
    category: "Creative",
    image: "/time-credits.jpg",
    instructors: 9,
    rating: 4.6,
    timeCredits: 5,
    level: "Intermediate",
    trending: true,
    featured: false,
  },
  {
    id: 5,
    title: "Financial Planning & Investment",
    category: "Business",
    image: "/hero-image.jpg",
    instructors: 5,
    rating: 4.7,
    timeCredits: 6,
    level: "Intermediate",
    trending: true,
    featured: false,
  },
  {
    id: 6,
    title: "Mobile App Development",
    category: "Technology",
    image: "/coding-workshop.jpg",
    instructors: 7,
    rating: 4.8,
    timeCredits: 5,
    level: "Intermediate",
    trending: true,
    featured: false,
  },
  {
    id: 7,
    title: "Content Creation & Strategy",
    category: "Creative",
    image: "/skill-teaching.jpg",
    instructors: 11,
    rating: 4.5,
    timeCredits: 4,
    level: "Beginner",
    trending: true,
    featured: false,
  },
  {
    id: 8,
    title: "UX/UI Design Principles",
    category: "Creative",
    image: "/ai-matching.jpg",
    instructors: 8,
    rating: 4.9,
    timeCredits: 5,
    level: "Intermediate",
    trending: true,
    featured: true,
  },
  {
    id: 9,
    title: "Public Speaking & Presentation",
    category: "Professional",
    image: "/time-credits.jpg",
    instructors: 6,
    rating: 4.7,
    timeCredits: 3,
    level: "Beginner",
    trending: true,
    featured: false,
  },
  {
    id: 10,
    title: "Photography Fundamentals",
    category: "Creative",
    image: "/hero-image.jpg",
    instructors: 9,
    rating: 4.6,
    timeCredits: 4,
    level: "Beginner",
    trending: true,
    featured: false,
  },
  {
    id: 11,
    title: "Blockchain & Cryptocurrency",
    category: "Technology",
    image: "/coding-workshop.jpg",
    instructors: 5,
    rating: 4.8,
    timeCredits: 7,
    level: "Advanced",
    trending: true,
    featured: false,
  },
  {
    id: 12,
    title: "Social Media Marketing",
    category: "Business",
    image: "/skill-teaching.jpg",
    instructors: 14,
    rating: 4.7,
    timeCredits: 4,
    level: "Intermediate",
    trending: true,
    featured: false,
  },
];

// Get badge color based on skill level
const getLevelBadgeColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "green";
    case "Intermediate":
      return "blue";
    case "Advanced":
      return "purple";
    default:
      return "gray";
  }
};

export default function SkillsMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter skills based on search query and selected category
  const filteredSkills = trendingSkills.filter((skill) => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? skill.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Skills Marketplace
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              Discover trending skills, find expert instructors, and start learning with time credits
            </p>
            
            {/* Search Bar */}
            <div className="relative flex items-center max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Search for skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FiFilter className="h-5 w-5 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Skills */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trending Skills
            </span>
            <Badge variant="gradient" className="ml-3">Hot</Badge>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.filter(skill => skill.featured).map((skill) => (
              <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={skill.image}
                    alt={skill.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="gradient">Trending</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" color={getLevelBadgeColor(skill.level)}>{skill.level}</Badge>
                    <Badge variant="outline" className="ml-2">{skill.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{skill.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <FiUsers className="mr-1" />
                    <span>{skill.instructors} instructors</span>
                    <div className="flex items-center ml-4">
                      <FiStar className="text-yellow-500 mr-1" />
                      <span>{skill.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <FiClock className="mr-1" />
                      <span>{skill.timeCredits} credits</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Link href={`/skills/${skill.id}`} className="flex items-center">
                        View <FiArrowRight className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* All Skills */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Skills</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill) => (
              <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={skill.image}
                    alt={skill.title}
                    fill
                    className="object-cover"
                  />
                  {skill.trending && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="gradient">Trending</Badge>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" color={getLevelBadgeColor(skill.level)}>{skill.level}</Badge>
                    <Badge variant="outline" className="ml-2">{skill.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{skill.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <FiUsers className="mr-1" />
                    <span>{skill.instructors} instructors</span>
                    <div className="flex items-center ml-4">
                      <FiStar className="text-yellow-500 mr-1" />
                      <span>{skill.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <FiClock className="mr-1" />
                      <span>{skill.timeCredits} credits</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Link href={`/skills/${skill.id}`} className="flex items-center">
                        View <FiArrowRight className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
