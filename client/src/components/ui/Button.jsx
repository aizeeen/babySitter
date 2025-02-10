export default function Button({ children, variant = 'primary', ...props }) {
  const baseClasses = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500",
    secondary: "text-primary-600 bg-white hover:bg-gray-50 focus:ring-primary-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
} 