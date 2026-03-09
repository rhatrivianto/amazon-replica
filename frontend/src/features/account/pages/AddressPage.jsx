import { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  useGetMyAddressesQuery, 
  useAddAddressMutation, 
  useUpdateAddressMutation, 
  useDeleteAddressMutation 
} from '../../../services/addressApi.js';
import AddressForm from '../components/AddressForm.jsx';

const AddressPage = () => {
  const { data, isLoading } = useGetMyAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingAddress, setEditingAddress] = useState(null);

  const addresses = data?.data || [];

  const handleAdd = async (formData) => {
    try {
      await addAddress(formData).unwrap();
      setView('list');
    } catch (err) {
      console.error("Failed to add address", err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateAddress({ id: editingAddress._id, ...formData }).unwrap();
      setView('list');
      setEditingAddress(null);
    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
    }
  };

  const handleSetDefault = async (address) => {
    await updateAddress({ id: address._id, isDefault: true });
  };

  if (isLoading) return <div className="p-10 text-center">Loading addresses...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/account" className="hover:underline">Your Account</Link> 
        <ChevronRight size={14} /> 
        <span className="text-[#c45500]">Your Addresses</span>
      </div>

      <h1 className="text-3xl font-normal mb-8">Your Addresses</h1>

      {/* VIEW: ADD FORM */}
      {view === 'add' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Add a new address</h2>
          <AddressForm 
            onSubmit={handleAdd} 
            onCancel={() => setView('list')} 
            isLoading={isAdding} 
          />
        </div>
      )}

      {/* VIEW: EDIT FORM */}
      {view === 'edit' && editingAddress && (
        <div>
          <h2 className="text-xl font-bold mb-4">Edit your address</h2>
          <AddressForm 
            initialData={editingAddress}
            onSubmit={handleUpdate} 
            onCancel={() => { setView('list'); setEditingAddress(null); }} 
            isLoading={isUpdating} 
          />
        </div>
      )}

      {/* VIEW: LIST GRID */}
      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Address Card */}
          <div 
            onClick={() => setView('add')}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 min-h-[260px]"
          >
            <Plus size={48} className="text-gray-400 mb-2" />
            <span className="text-xl font-bold text-gray-700">Add Address</span>
          </div>

          {/* Existing Addresses */}
          {addresses.map((addr) => (
            <div key={addr._id} className="border border-gray-300 rounded-lg p-0 flex flex-col min-h-[260px] relative">
              {addr.isDefault && (
                <div className="border-b px-4 py-2 text-xs text-gray-500">
                  Default: <span className="text-gray-700 font-bold">Amazon</span>
                </div>
              )}
              
              <div className="p-4 flex-1 text-sm text-gray-900 leading-relaxed">
                <p className="font-bold">{addr.fullName}</p>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                <p>{addr.country}</p>
                <p className="mt-2">Phone number: {addr.phone}</p>
              </div>

              <div className="p-4 mt-auto text-sm text-blue-600 flex gap-4 items-center">
                <button 
                  onClick={() => { setEditingAddress(addr); setView('edit'); }}
                  className="hover:underline hover:text-[#c45500]"
                >
                  Edit
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => handleDelete(addr._id)}
                  className="hover:underline hover:text-[#c45500]"
                >
                  Remove
                </button>
                {!addr.isDefault && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => handleSetDefault(addr)}
                      className="hover:underline hover:text-[#c45500]"
                    >
                      Set as Default
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressPage;
