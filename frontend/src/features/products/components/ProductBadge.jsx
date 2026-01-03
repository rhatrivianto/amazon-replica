

const ProductBadge = ({ type }) => {
  // Amazon Style Badges
  const badges = {
    bestSeller: {
      text: "Best Seller",
      className: "bg-[#e47911] text-white text-[11px] font-bold px-2 py-0.5 rounded-r-sm relative -ml-4 mb-2 inline-block",
      style: { clipPath: "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)" }
    },
    limitedDeal: {
      text: "Limited Time Deal",
      className: "bg-[#cc0c39] text-white text-[12px] font-bold px-2 py-1 inline-block mb-1",
      style: {}
    },
    amazonsChoice: {
      text: "Amazon's Choice",
      className: "bg-[#232f3e] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 w-max mb-1",
      style: {}
    }
  };

  const badge = badges[type];
  if (!badge) return null;

  return (
    <div className={badge.className} style={badge.style}>
      {type === 'amazonsChoice' && <span className="text-[#ffa41c]">Amazon&apos;s</span>}
      {type === 'amazonsChoice' ? ' Choice' : badge.text}
    </div>
  );
};

export default ProductBadge;