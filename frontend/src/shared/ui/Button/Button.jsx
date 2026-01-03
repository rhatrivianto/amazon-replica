export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed border";

  const variants = {
    // Amazon Yellow Button
    primary: "bg-[#ffd814] border-[#fcd200] text-[#0f1111] hover:bg-[#f7ca00] focus:ring-[#fcd200] shadow-sm",
    // Amazon Orange Button
    secondary: "bg-[#ffa41c] border-[#ff8f00] text-[#0f1111] hover:bg-[#f8961d] focus:ring-[#ff8f00] shadow-sm",
    danger: "bg-red-600 border-red-700 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "bg-white border-[#D5D9D9] text-[#0f1111] hover:bg-gray-50 focus:ring-gray-300 shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  );
};