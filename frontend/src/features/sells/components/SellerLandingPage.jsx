

const SellerLandingPage = ({ onRegister }) => {
  return (
    <div className="relative bg-white font-sans">
      {/* Hero Section */}
      <div className="bg-[#f2f4f8] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Left Content */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Become an <br/> Amazon Seller
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              More than half the units sold in our stores are from independent sellers. Start your selling journey today.
            </p>
            <button 
              onClick={onRegister}
              className="bg-[#e47911] hover:bg-[#d16d0e] text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform transform active:scale-95 text-lg"
            >
              Sign up
            </button>
            <p className="text-sm text-gray-500">
              $39.99 a month + selling fees
            </p>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 flex justify-center">
             <img 
               src="https://m.media-amazon.com/images/G/01/sell/images/prime-selling-guide/prime-selling-guide-hero-image._CB1582662667_.png" 
               alt="Amazon Seller Hero" 
               className="max-w-full h-auto object-contain drop-shadow-xl"
             />
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { label: "Sales by third-party sellers", value: "$3.5B+" },
            { label: "Prime members worldwide", value: "200M+" },
            { label: "Countries and regions served", value: "185" }
          ].map((stat, idx) => (
            <div key={idx} className="p-4">
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerLandingPage;