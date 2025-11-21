import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "",
  variant = "default" 
}) => {
  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <ApperIcon name="AlertCircle" className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-red-700">{message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-shrink-0 text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
            >
              Retry
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}
    >
      <div className="text-center space-y-6 max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="AlertTriangle" className="h-10 w-10 text-red-500" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-800">Oops! Something went wrong</h3>
          <p className="text-slate-600">{message}</p>
        </div>

        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ApperIcon name="RotateCcw" className="h-4 w-4" />
            <span>Try Again</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorView;