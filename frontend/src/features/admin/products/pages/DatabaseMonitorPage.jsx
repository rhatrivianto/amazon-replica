
import { Database, ShieldCheck } from 'lucide-react';

const DatabaseMonitor = () => {
  return (
    <div className="p-8 bg-white m-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <Database className="text-[#e47911]" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">System Database Monitor</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
          <p className="text-xs text-green-600 font-bold uppercase">Status</p>
          <p className="text-xl font-bold text-green-700 flex items-center gap-2">
            <ShieldCheck size={20} /> Operational
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-600 font-bold uppercase">Latency</p>
          <p className="text-xl font-bold text-blue-700">24ms</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
          <p className="text-xs text-orange-600 font-bold uppercase">Load</p>
          <p className="text-xl font-bold text-orange-700">1.2%</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseMonitor;