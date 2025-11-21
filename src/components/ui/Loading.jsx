import { motion } from "framer-motion";

const Loading = ({ variant = "default", className = "" }) => {
  if (variant === "table") {
    return (
      <div className={`p-6 space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gradient-to-r from-slate-200 to-slate-100 h-12 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="animate-pulse space-y-4">
              <div className="bg-gradient-to-r from-primary-200 to-primary-100 h-12 w-12 rounded-lg"></div>
              <div className="bg-gradient-to-r from-slate-200 to-slate-100 h-8 w-16 rounded"></div>
              <div className="bg-gradient-to-r from-slate-200 to-slate-100 h-4 w-24 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50 ${className}`}>
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600 mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-primary-300 mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-700 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Loading ClassTrack
          </h3>
          <p className="text-slate-500">Preparing your student management dashboard...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;