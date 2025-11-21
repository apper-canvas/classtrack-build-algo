import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "BookOpen" }
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-primary-900 to-primary-800 shadow-xl">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 bg-primary-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">ClassTrack</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : "text-primary-100 hover:bg-white/10 hover:text-white"
                  )
                }
              >
                <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Teacher Portal</p>
                  <p className="text-xs text-primary-200">Admin Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-64 h-full bg-gradient-to-b from-primary-900 to-primary-800 shadow-2xl"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-6 bg-primary-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-white">ClassTrack</h1>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white transition-colors duration-200"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-primary-100 hover:bg-white/10 hover:text-white"
                    )
                  }
                >
                  <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;