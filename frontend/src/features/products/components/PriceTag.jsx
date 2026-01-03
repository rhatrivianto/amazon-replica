const PriceTag = ({ price, discountPercentage = 0 }) => {
  const finalPrice = discountPercentage > 0 ? price * (1 - discountPercentage / 100) : price;
  
  return (
    <div className="flex flex-col">
      <div className="flex items-start text-black">
        <span className="text-[13px] mt-1 font-medium">$</span>
        <span className="text-2xl font-medium">{Math.floor(finalPrice)}</span>
        <span className="text-[13px] mt-1 font-medium">
          {(finalPrice % 1).toFixed(2).substring(2)}
        </span>
      </div>
      
      {discountPercentage > 0 && (
        <div className="flex items-center gap-2 text-[12px] mt-1">
          <span className="text-gray-500 line-through">
            List: ${price.toFixed(2)}
          </span>
          <span className="bg-[#cc0c39] text-white px-1 font-bold rounded-sm">
            {discountPercentage}% off
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceTag;