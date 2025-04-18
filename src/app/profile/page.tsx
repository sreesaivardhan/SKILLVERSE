'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiMail, FiEdit2, FiSave, FiX, FiUpload } from 'react-icons/fi';
import { RootState } from '@/lib/redux/store';
import { loadUser } from '@/lib/redux/slices/authSlice';
import axiosInstance from '@/lib/api/axios';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    profileImage: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [isAuthenticated, loading, router, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      // Create form data if there's an image
      let data;
      if (imageFile) {
        const formData = new FormData();
        formData.append('name', profileData.name);
        formData.append('bio', profileData.bio);
        formData.append('profileImage', imageFile);
        data = formData;
      } else {
        data = {
          name: profileData.name,
          bio: profileData.bio
        };
      }
      
      // Update profile
      await axiosInstance.put('/api/users/profile', data, {
        headers: imageFile ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      
      // Reload user data
      await dispatch(loadUser() as any);
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    
    // Reset form data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        profileImage: user.profileImage || ''
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">My Profile</h1>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="text-white border-white hover:bg-white/20"
                >
                  <FiEdit2 className="mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className="text-white border-white hover:bg-white/20"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="default"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <FiSave className="mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Alerts */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-6">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-6">
              <p>{success}</p>
            </div>
          )}
          
          {/* Profile content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Profile image */}
              <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : profileData.profileImage ? (
                      <img
                        src={profileData.profileImage}
                        alt={profileData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-300">
                        <FiUser size={48} />
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <label
                      htmlFor="profile-image-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      <FiUpload size={16} />
                      <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 capitalize">
                    {user?.role}
                  </p>
                </div>
                
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg w-full">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Credits Balance
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Available</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {user?.credits || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Profile details */}
              <div className="md:w-2/3 md:pl-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                        />
                      ) : (
                        <div className="flex items-center">
                          <FiUser className="text-gray-400 mr-2" />
                          <span className="text-gray-900 dark:text-white">
                            {profileData.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center">
                        <FiMail className="text-gray-400 mr-2" />
                        <span className="text-gray-900 dark:text-white">
                          {profileData.email}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300">
                          {profileData.bio || 'No bio provided yet.'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        My Skills
                      </h3>
                      {user?.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <div
                              key={index}
                              className={`px-3 py-1 rounded-full text-sm font-medium 
                                ${skill.verified 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                }
                              `}
                            >
                              {skill.name}
                              {skill.verified && (
                                <span className="ml-1 text-xs">✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          No skills added yet. Add skills from your dashboard.
                        </p>
                      )}
                      
                      <div className="mt-4">
                        <Button
                          onClick={() => router.push('/dashboard')}
                          variant="outline"
                          size="sm"
                        >
                          Manage Skills
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
