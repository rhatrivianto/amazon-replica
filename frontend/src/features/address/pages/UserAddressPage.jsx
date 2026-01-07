import { useState } from 'react';
import { useGetMyAddressesQuery, useAddAddressMutation, useDeleteAddressMutation } from '../../../services/addressApi.js';
import { Plus, MapPin, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserAddressPage = () => {
  const { data, isLoading } = useGetMyAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [showForm, setShowForm] = useState(false);

  const addresses = data?.data || [];

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAddress = Object.fromEntries(formData.entries());
    
    try {
      await addAddress(newAddress).unwrap();
      toast.success('Address added successfully');
      setShowForm(false);
      e.target.reset();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add address');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this address?")) {
      await deleteAddress(id);
      toast.success("Address deleted");
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#e47911]" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <MapPin className="text-[#e47911]" /> Your Addresses
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Add Address Card */}
        <div 
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-[250px]"
        >
          <Plus size={40} className="text-gray-400 mb-2" />
          <h2 className="font-bold text-gray-600">Add Address</h2>
        </div>

        {/* Address List */}
        {addresses.map((addr) => (
          <div key={addr._id} className="border border-gray-300 rounded-lg p-6 relative h-[250px] flex flex-col">
            {addr.isDefault && <span className="text-xs text-gray-500 mb-2">Default:</span>}
            <h3 className="font-bold">{addr.fullName}</h3>
            <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
            <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zipCode}</p>
            <p className="text-sm text-gray-600">{addr.country}</p>
            <p className="text-sm text-gray-600 mt-2">Phone: {addr.phone}</p>
            
            <div className="mt-auto flex gap-2 text-sm text-[#007185]">
              <button className="hover:underline">Edit</button>
              <span>|</span>
              <button onClick={() => handleDelete(addr._id)} className="hover:underline text-red-600 flex items-center gap-1">
                Remove <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add a new address</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input name="fullName" placeholder="Full Name" required className="w-full border p-2 rounded" />
              <input name="phone" placeholder="Phone Number" required className="w-full border p-2 rounded" />
              <input name="street" placeholder="Street Address" required className="w-full border p-2 rounded" />
              <div className="grid grid-cols-2 gap-3">
                <input name="city" placeholder="City" required className="w-full border p-2 rounded" />
                <input name="state" placeholder="State/Province" required className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="zipCode" placeholder="Zip Code" required className="w-full border p-2 rounded" />
                <input name="country" defaultValue="Indonesia" className="w-full border p-2 rounded" />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={isAdding} className="bg-[#ffd814] px-4 py-2 rounded font-bold text-sm">
                  {isAdding ? 'Saving...' : 'Add Address'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAddressPage;
