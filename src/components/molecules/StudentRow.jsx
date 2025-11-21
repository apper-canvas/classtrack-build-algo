import { motion } from "framer-motion";
import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const StudentRow = ({ student, onView, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "suspended":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white hover:bg-primary-50/30 transition-colors duration-200 border-b border-slate-100"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
{student.first_name_c?.[0]}{student.last_name_c?.[0]}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {student.first_name_c} {student.last_name_c}
            </p>
            <p className="text-sm text-slate-500">{student.email_c}</p>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 text-sm text-slate-900">
        {student.student_id_c}
      </td>
      
      <td className="px-6 py-4 text-sm text-slate-900">
        {student.grade_level_c}
      </td>
      
      <td className="px-6 py-4 text-sm text-slate-900">
        {student.section_c}
      </td>
      
      <td className="px-6 py-4 text-sm text-slate-500">
        {format(new Date(student.enrollment_date_c), "MMM dd, yyyy")}
      </td>
      
<td className="px-6 py-4">
        {student.status_c === "active" ? (
          <Badge variant="success" size="sm">Active</Badge>
        ) : student.status_c === "inactive" ? (
          <Badge variant="secondary" size="sm">Inactive</Badge>
        ) : (
          <Badge variant="info" size="sm">Graduated</Badge>
        )}
      </td>
      
      <td className="px-6 py-4 text-sm">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            icon="Edit"
            onClick={() => onEdit(student)}
            className="text-slate-600 hover:text-primary-600"
          />
          <Button
            size="sm"
            variant="ghost"
            icon="Trash2"
            onClick={() => onDelete(student)}
            className="text-slate-600 hover:text-red-600"
          />
        </div>
      </td>
    </motion.tr>
  );
};

export default StudentRow;