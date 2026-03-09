import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserCredentials } from '../../auth/authSlice';
import { useUpdateMeMutation, useUpdateMyPasswordMutation } from '../../../services/accountApi';
import { toast } from 'react-hot-toast';

const FormSection = ({ title, children }) => (
  <div className="border border-gray-300 rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4">{title}</h2>
    {children}
  </div>
);

const LoginSecurityPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const [updateMe, { isLoading: isUpdatingMe }] = useUpdateMeMutation();
  const [updateMyPassword, { isLoading: isUpdatingPassword }] = useUpdateMyPasswordMutation();

  const { register: registerInfo, handleSubmit: handleSubmitInfo, formState: { errors: errorsInfo } } = useForm({
    defaultValues: { name: userInfo?.name || '' }
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword }, reset: resetPasswordForm, watch } = useForm();

  const newPassword = watch('password');

  const onInfoSubmit = async (data) => {
    try {
      const result = await updateMe(data).unwrap();
      dispatch(setUserCredentials({ user: result.data.user })); // Update user info in redux
      toast.success('Name updated successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update name.');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      const result = await updateMyPassword(data).unwrap();
      // Update token in auth slice
      dispatch(setUserCredentials({ token: result.token }));
      toast.success('Password updated successfully!');
      resetPasswordForm();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-normal mb-8">Login & Security</h1>

      <div className="space-y-8">
        {/* Form Ganti Nama */}
        <FormSection title="Personal Information">
          <form onSubmit={handleSubmitInfo(onInfoSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                {...registerInfo('name', { required: 'Name is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errorsInfo.name && <p className="text-red-500 text-xs mt-1">{errorsInfo.name.message}</p>}
            </div>
            <div className="text-right">
              <button type="submit" disabled={isUpdatingMe} className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-50">
                {isUpdatingMe ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </FormSection>

        {/* Form Ganti Password */}
        <FormSection title="Change Password">
          <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
            <div>
              <label htmlFor="passwordCurrent" className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                id="passwordCurrent"
                type="password"
                {...registerPassword('passwordCurrent', { required: 'Current password is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errorsPassword.passwordCurrent && <p className="text-red-500 text-xs mt-1">{errorsPassword.passwordCurrent.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                id="password"
                type="password"
                {...registerPassword('password', { 
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errorsPassword.password && <p className="text-red-500 text-xs mt-1">{errorsPassword.password.message}</p>}
            </div>
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                id="passwordConfirm"
                type="password"
                {...registerPassword('passwordConfirm', {
                  required: 'Please confirm your new password',
                  validate: value => value === newPassword || 'The passwords do not match'
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errorsPassword.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errorsPassword.passwordConfirm.message}</p>}
            </div>
            <div className="text-right">
              <button type="submit" disabled={isUpdatingPassword} className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-50">
                {isUpdatingPassword ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </FormSection>
      </div>
    </div>
  );
};

export default LoginSecurityPage;