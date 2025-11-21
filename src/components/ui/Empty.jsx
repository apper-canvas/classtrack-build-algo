import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing to show here yet.", 
  actionLabel, 
  onAction, 
  icon = "Inbox",
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}
    >
      <div className="text-center space-y-6 max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center"
        >
          <ApperIcon name={icon} className="h-10 w-10 text-primary-600" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>

        {actionLabel && onAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAction}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>{actionLabel}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;