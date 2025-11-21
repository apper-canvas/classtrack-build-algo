import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/students":
        return "Students";
      case "/attendance":
        return "Attendance";
      case "/grades":
        return "Grades";
      default:
        return "ClassTrack";
    }
  };

  const getPageDescription = (pathname) => {
    switch (pathname) {
      case "/":
        return "Overview of your student management system";
      case "/students":
        return "Manage student profiles and information";
      case "/attendance":
        return "Track and manage student attendance";
      case "/grades":
        return "Record and manage student grades";
      default:
        return "Student Management System";
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-slate-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuToggle}
            className="lg:hidden"
          />
          
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                ClassTrack
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 mx-8 max-w-2xl hidden md:block">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              {getPageTitle(location.pathname)}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {getPageDescription(location.pathname)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick actions */}
          <Button
            size="sm"
            variant="outline"
            icon="Plus"
            onClick={() => navigate("/students")}
            className="hidden sm:flex"
          >
            Add Student
          </Button>
          
          {/* Notifications */}
          <Button
            size="sm"
            variant="ghost"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>

      {/* Mobile page title */}
      <div className="mt-3 md:hidden">
        <h2 className="text-lg font-semibold text-slate-900">
          {getPageTitle(location.pathname)}
        </h2>
        <p className="text-sm text-slate-600">
          {getPageDescription(location.pathname)}
        </p>
      </div>
    </motion.header>
  );
};

export default Header;