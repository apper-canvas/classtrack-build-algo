import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="BookX" className="h-12 w-12 text-primary-600" />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-slate-900">
            Page Not Found
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            icon="ArrowLeft"
          >
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate("/")}
            icon="Home"
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="pt-8 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => navigate("/students")}
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              → Students
            </button>
            <button
              onClick={() => navigate("/attendance")}
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              → Attendance
            </button>
            <button
              onClick={() => navigate("/grades")}
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              → Grades
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              → Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;