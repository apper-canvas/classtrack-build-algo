import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon, 
  color = "primary",
  loading = false,
  className = "" 
}) => {
  const colors = {
    primary: "from-primary-500 to-primary-600",
    success: "from-emerald-500 to-emerald-600", 
    warning: "from-amber-500 to-amber-600",
    error: "from-red-500 to-red-600",
    info: "from-blue-500 to-blue-600"
  };

  const changeColors = {
    positive: "text-emerald-600",
    negative: "text-red-600",
    neutral: "text-slate-600"
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className={`bg-gradient-to-r ${colors[color]} h-12 w-12 rounded-lg opacity-20`}></div>
          <div className="bg-slate-200 h-8 w-16 rounded"></div>
          <div className="bg-slate-200 h-4 w-24 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`p-6 ${className}`} hover>
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${colors[color]} rounded-lg`}>
              <ApperIcon name={icon} className="h-6 w-6 text-white" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-600">{title}</h3>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              
              {change && (
                <div className={`flex items-center space-x-1 text-sm ${changeColors[changeType]}`}>
                  <ApperIcon 
                    name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                    className="h-4 w-4" 
                  />
                  <span>{change}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;