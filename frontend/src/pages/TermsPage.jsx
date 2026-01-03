import { ArrowLeft, FileText, Scale, ShieldAlert, Ban } from "lucide-react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="pt-24 pb-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Link to="/" className="text-blue-700 hover:underline flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <header className="border-b pb-6 mb-8">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <FileText className="w-8 h-8" />
            <h1 className="text-3xl font-bold text-gray-900">Conditions of Use</h1>
          </div>
          <p className="text-sm text-gray-500 italic">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="space-y-8 text-gray-800 leading-relaxed text-sm">
          <section>
            <p className="mb-4">Welcome to Rully Store. We provide website features and other products and services to you when you visit or shop at rully.store, subject to the following conditions. <strong>By using our services, you agree to these conditions. Please read them carefully.</strong></p>
          </section>

          <section className="bg-gray-50 p-6 rounded border border-gray-200">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900">
              <Scale className="w-5 h-5 text-gray-500" /> Electronic Communications
            </h2>
            <p>When you use Rully Store Services, or send e-mails, text messages, and other communications from your desktop or mobile device to us, you may be communicating with us electronically. You consent to receive communications from us electronically, such as e-mails, texts, or notices on this site.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900">
              <ShieldAlert className="w-5 h-5 text-gray-500" /> Your Account
            </h2>
            <p>You may need your own Rully Store account to use certain services, and you may be required to be logged in to the account and have a valid payment method associated with it. You are responsible for maintaining the confidentiality of your account and password.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900">
              <Ban className="w-5 h-5 text-gray-500" /> Reviews and Content
            </h2>
            <p>Visitors may post reviews, comments, photos, videos, and other content, so long as the content is not illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties.</p>
          </section>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-xs text-gray-700 italic">
            Note: These terms are governing the use of the Rully Store platform. For individual product warranties, please refer to the specific product details page.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;