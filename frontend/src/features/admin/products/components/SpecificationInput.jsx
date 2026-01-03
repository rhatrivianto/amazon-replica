import { Plus, Trash2 } from 'lucide-react';

const SpecificationInput = ({ specifications, setSpecifications }) => {
  const addField = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeField = (index) => {
    const updated = specifications.filter((_, i) => i !== index);
    setSpecifications(updated);
  };

  const handleChange = (index, field, val) => {
    const updated = specifications.map((spec, i) => 
      i === index ? { ...spec, [field]: val } : spec
    );
    setSpecifications(updated);
  };

  return (
    <div className="space-y-3 p-4 bg-gray-900/30 border border-gray-700 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">
          Technical Specifications
        </label>
        <button
          type="button"
          onClick={addField}
          className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
        >
          <Plus size={14} /> Add Specification
        </button>
      </div>

      {specifications.length === 0 && (
        <p className="text-xs text-gray-500 italic">No specifications added yet.</p>
      )}

      {specifications.map((spec, index) => (
        <div key={index} className="flex gap-2 items-start animate-in slide-in-from-left-2 duration-200">
          <input
            type="text"
            placeholder="e.g. Voltage"
            value={spec.key}
            onChange={(e) => handleChange(index, 'key', e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-sm text-white focus:ring-1 focus:ring-yellow-500 outline-none"
          />
          <input
            type="text"
            placeholder="e.g. 120 Volts"
            value={spec.value}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-sm text-white focus:ring-1 focus:ring-yellow-500 outline-none"
          />
          <button
            type="button"
            onClick={() => removeField(index)}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <p className="text-[10px] text-gray-500 mt-2">
        * Specifications will be displayed in the &quotProduct Information&quot table.
      </p>
    </div>
  );
};

export default SpecificationInput;