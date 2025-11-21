import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500 shadow-sm hover:shadow",
    outline: "border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-500",
    danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500 shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm space-x-1.5",
    md: "px-4 py-2.5 text-sm space-x-2",
    lg: "px-6 py-3 text-base space-x-2.5"
  };

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" className={cn(iconSize[size], "animate-spin")} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} className={iconSize[size]} />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} className={iconSize[size]} />
          )}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;