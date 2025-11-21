import { motion } from "framer-motion";
import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

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
                {student.firstName[0]}{student.lastName[0]}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-sm text-slate-500">{student.email}</p>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 text-sm text-slate-900 font-mono">
        {student.studentId}
      </td>
      
      <td className="px-6 py-4 text-sm text-slate-900">
        Grade {student.gradeLevel}
      </td>
      
      <td className="px-6 py-4 text-sm text-slate-900">
        {student.section}
      </td>
      
      <td className="px-6 py-4 text-sm text-slate-500">
        {format(new Date(student.enrollmentDate), "MMM dd, yyyy")}
      </td>
      
      <td className="px-6 py-4">
        <Badge variant={getStatusColor(student.status)}>
          {student.status}
        </Badge>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            icon="Eye"
            onClick={() => onView(student)}
            className="text-slate-600 hover:text-primary-600"
          />
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