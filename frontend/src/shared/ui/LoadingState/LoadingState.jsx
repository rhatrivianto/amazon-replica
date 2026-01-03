export const LoadingState = ({
  message = "Loading...",
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-[6px]",
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] w-full ${className}`}>
      <div
        className={`${sizes[size]} border-[#f3f3f3] border-t-[#e47911] rounded-full animate-spin mb-4`}
      ></div>
      <p className="text-[#111] text-sm font-medium">{message}</p>
    </div>
  );
};