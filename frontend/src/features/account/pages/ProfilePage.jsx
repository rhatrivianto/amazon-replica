import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { MapPin, Camera, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { selectUserInfo, setUserCredentials } from '../../auth/authSlice';
import { useUpdateMeMutation } from '../../../services/accountApi';

const ProfilePage = () => {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: userInfo?.name || '',
      bio: userInfo?.bio || '',
      location: userInfo?.location || '',
      avatar: userInfo?.avatar || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const result = await updateMe(data).unwrap();
      dispatch(setUserCredentials({ user: result.data.user }));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-3xl font-normal">Your Profile</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Kolom Kiri: Avatar & Info Dasar */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg border border-gray-200 h-fit">
          <div className="relative w-32 h-32 mb-4">
            <img 
              src={userInfo?.avatar || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
            />
            {isEditing && (
              <div className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700">
                <Camera size={16} />
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900">{userInfo?.name}</h2>
          {userInfo?.location && (
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin size={14} /> {userInfo.location}
            </div>
          )}
          
          {!isEditing && userInfo?.bio && (
            <p className="text-gray-600 mt-4 text-sm italic">&quot;{userInfo.bio}&quot;</p>
          )}
        </div>

        {/* Kolom Kanan: Form Edit atau Detail */}
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                <textarea
                  rows="3"
                  {...register('bio', { maxLength: { value: 300, message: 'Max 300 characters' } })}
                  placeholder="Tell us something about yourself..."
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  {...register('location')}
                  placeholder="City, Country"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Avatar URL</label>
                <input
                  type="text"
                  {...register('avatar')}
                  placeholder="https://example.com/my-photo.jpg"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Paste an image URL here.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">About</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 border-b pb-3">
                  <span className="text-gray-500 text-sm">Bio</span>
                  <span className="col-span-2 text-gray-900 text-sm">{userInfo?.bio || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b pb-3">
                  <span className="text-gray-500 text-sm">Location</span>
                  <span className="col-span-2 text-gray-900 text-sm">{userInfo?.location || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="col-span-2 text-gray-900 text-sm">{userInfo?.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;