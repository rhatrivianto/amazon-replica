import { useState, useEffect } from 'react';

const AddressForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    country: 'Indonesia',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Pastikan field yang tidak ada di DB tetap memiliki default value string kosong
        country: initialData.country || 'Indonesia',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-sm";
  const labelClass = "block font-bold text-sm mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="space-y-4">
        {/* Country */}
        <div>
          <label className={labelClass}>Country/Region</label>
          <select 
            name="country" 
            value={formData.country} 
            onChange={handleChange}
            className={`${inputClass} bg-gray-100 cursor-not-allowed`}
            disabled
          >
            <option value="Indonesia">Indonesia</option>
          </select>
        </div>

        {/* Full Name */}
        <div>
          <label className={labelClass}>Full name (First and Last name)</label>
          <input 
            type="text" 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange} 
            className={inputClass} 
            required 
          />
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>Phone number</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="0812..."
            required 
          />
        </div>

        {/* Street */}
        <div>
          <label className={labelClass}>Address</label>
          <input 
            type="text" 
            name="street" 
            value={formData.street} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="Street address, P.O. box, company name, c/o"
            required 
          />
        </div>

        {/* City & State & Zip */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>City</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              className={inputClass} 
              required 
            />
          </div>
          <div>
            <label className={labelClass}>State / Province</label>
            <input 
              type="text" 
              name="state" 
              value={formData.state} 
              onChange={handleChange} 
              className={inputClass} 
              required 
            />
          </div>
          <div>
            <label className={labelClass}>Zip Code</label>
            <input 
              type="text" 
              name="zipCode" 
              value={formData.zipCode} 
              onChange={handleChange} 
              className={inputClass} 
              required 
            />
          </div>
        </div>

        {/* Default Checkbox */}
        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="isDefault" 
            name="isDefault" 
            checked={formData.isDefault} 
            onChange={handleChange}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="text-sm">Make this my default address</label>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg px-4 py-1.5 text-sm shadow-sm font-medium"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update address' : 'Add address')}
          </button>
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="hover:underline text-sm text-blue-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddressForm;
