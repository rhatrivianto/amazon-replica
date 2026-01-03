import { Shield, Database } from "lucide-react";

const PrivacyPage = () => {
  return (
    <div className="pt-24 pb-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <header className="border-b pb-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Notice</h1>
          <p className="text-sm text-gray-500 mt-2 italic">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="space-y-10 text-gray-800 leading-relaxed">
          <section className="flex gap-6">
            <Shield className="w-12 h-12 text-emerald-600 shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">Our Commitment</h2>
              <p>We know that you care how information about you is used and shared, and we appreciate your trust that we will do so carefully and sensibly.</p>
            </div>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" /> Information We Collect
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>Information you give us (Name, Address, Email)</li>
              <li>Automatic information (Cookies, Browsing History)</li>
              <li>Information from other sources (Shipping carriers, Credit bureaus)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">How We Use Your Data</h2>
            <p className="text-sm">We use your personal information to operate, provide, develop, and improve the products and services that we offer our customers. These purposes include: Purchase and delivery of products, provide recommendations, and comply with legal obligations.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;