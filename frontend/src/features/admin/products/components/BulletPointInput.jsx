import { Plus, Trash2, List } from 'lucide-react';

const BulletPointInput = ({ bulletPoints, setBulletPoints }) => {
  const addPoint = () => {
    if (bulletPoints.length < 5) {
      setBulletPoints([...bulletPoints, '']);
    }
  };

  const removePoint = (index) => {
    const updated = bulletPoints.filter((_, i) => i !== index);
    setBulletPoints(updated);
  };

  const handleChange = (index, val) => {
    const updated = bulletPoints.map((point, i) => (i === index ? val : point));
    setBulletPoints(updated);
  };

  return (
    <div className="space-y-3 p-4 bg-gray-900/30 border border-gray-700 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <List size={16} className="text-yellow-500" /> About this item
        </label>
        <button
          type="button"
          onClick={addPoint}
          disabled={bulletPoints.length >= 5}
          className={`text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors ${
            bulletPoints.length >= 5 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-green-700 hover:bg-green-600 text-white'
          }`}
        >
          <Plus size={14} /> Add Feature {bulletPoints.length}/5
        </button>
      </div>

      <div className="space-y-2">
        {bulletPoints.map((point, index) => (
          <div key={index} className="flex gap-2 items-center animate-in fade-in duration-300">
            <span className="text-yellow-500 font-bold">•</span>
            <input
              type="text"
              placeholder={`Feature highlight #${index + 1}`}
              value={point}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-sm text-white focus:ring-1 focus:ring-yellow-500 outline-none"
            />
            <button
              type="button"
              onClick={() => removePoint(index)}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-500 mt-1">
        * Focus on key benefits and product highlights. Max 5 points.
      </p>
    </div>
  );
};

export default BulletPointInput;