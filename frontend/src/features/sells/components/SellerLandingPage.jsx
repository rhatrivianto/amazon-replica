import { CheckCircle2, ArrowRight, Loader2, Quote } from 'lucide-react';
import { useGetSellerContentsQuery } from '../../../services/sellerContentApi.js';

const SellerLandingPage = ({ onRegister }) => {
  const { data: contentData, isLoading } = useGetSellerContentsQuery();
  
  // Filter Data per Section
  const heroContent = contentData?.data?.find(c => c.section === 'hero');
  const guides = contentData?.data?.filter(c => c.section === 'guides') || [];
  const incentive = contentData?.data?.find(c => c.section === 'incentives');
  const testimony = contentData?.data?.find(c => c.section === 'testimony');

  return (
    <div className="bg-white font-sans text-[#0F1111]">
      
      {/* 1. Hero Section */}
      <section className="max-w-[1500px] mx-auto px-4 lg:px-8 py-12 lg:py-20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            {heroContent?.title || "Create an Amazon seller account"}
          </h1>
          <button 
            onClick={onRegister}
            className="bg-[#FF9900] hover:bg-[#e68a00] text-white font-bold py-3 px-10 rounded-full text-lg shadow-sm transition-colors"
          >
            Sign up
          </button>
          <p className="text-sm text-gray-600 italic">
            {heroContent?.description || "Get 5% back on your first $1,000,000 in branded sales."}
          </p>
        </div>
        <div className="flex-1">
          <img 
            src={heroContent?.imageUrl || "https://m.media-amazon.com/images/G/01/sell/images/prime-day-seller-hero._CB1198675309_.png"} 
            alt="Seller Hero" 
            className="rounded-lg shadow-xl w-full object-cover"
          />
        </div>
      </section>

      {/* 2. Mini Quiz Section */}
      <section className="bg-[#f8f8f8] py-16 border-y border-gray-200">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Not sure where to begin?</h2>
          <p className="text-gray-600 mb-8 text-lg">Answer a few questions to find the best way to sell.</p>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <p className="font-bold text-lg mb-6">Where is your business based?</p>
            <div className="space-y-3">
              <button className="w-full border border-gray-300 p-4 rounded-full hover:border-[#e47911] hover:bg-orange-50 transition-all text-left font-medium flex justify-between group">
                In the US
                <ArrowRight className="opacity-0 group-hover:opacity-100 text-[#e47911] transition-opacity" />
              </button>
              <button className="w-full border border-gray-300 p-4 rounded-full hover:border-[#e47911] hover:bg-orange-50 transition-all text-left font-medium flex justify-between group">
                Outside the US
                <ArrowRight className="opacity-0 group-hover:opacity-100 text-[#e47911] transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Incentives Section */}
      {incentive && (
      <section className="max-w-[1500px] mx-auto px-4 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row gap-12 bg-[#f4fafa] p-8 md:p-12 rounded-2xl border border-blue-100 items-center">
          <div className="flex-1">
             <img 
               src={incentive.imageUrl || "https://m.media-amazon.com/images/G/01/sell/images/incentives-v2._CB1198675309_.jpg"} 
               alt="Incentives" 
               className="rounded-lg shadow-md w-full"
             />
          </div>
          <div className="flex-1 space-y-6">
            <span className="bg-[#007185] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {incentive.subtitle || "New Seller Incentives"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111]">{incentive.title}</h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              {/* Split deskripsi berdasarkan baris baru untuk membuat list */}
              {incentive.description.split('\n').map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 shrink-0 mt-1" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <button className="text-[#007185] hover:underline hover:text-[#c7511f] font-bold mt-4 flex items-center gap-1">
              See all incentives <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
      )}

      {/* 4. Article Grid Section (Learn more) */}
      <section className="max-w-[1500px] mx-auto px-4 lg:px-8 py-16 mb-10">
        <h2 className="text-3xl font-bold mb-10 text-center">Learn more about selling</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#e47911]" size={40} />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((item) => (
            <div key={item._id} className="border-t-4 border-[#e47911] pt-6 p-6 bg-white shadow-sm hover:shadow-lg transition-all cursor-pointer group">
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#e47911] transition-colors">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
              <div className="mt-4 text-[#007185] font-bold text-sm group-hover:underline flex items-center gap-1">
                Learn more <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* 5. Testimony Section (Optional) */}
      {testimony && (
        <section className="bg-[#232f3e] text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Quote className="mx-auto text-[#e47911] mb-6" size={48} />
            <blockquote className="text-2xl font-medium italic mb-8 leading-relaxed">
              &quot;{testimony.description}&quot;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              {testimony.imageUrl && (
                <img src={testimony.imageUrl} alt="Owner" className="w-12 h-12 rounded-full border-2 border-white" />
              )}
              <div className="text-left">
                <div className="font-bold text-[#e47911]">{testimony.title}</div>
                <div className="text-sm text-gray-400">{testimony.subtitle}</div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default SellerLandingPage;
