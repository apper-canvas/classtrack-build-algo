import { useState } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AttendanceCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  attendanceData = {},
  onMarkAttendance 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getAttendanceForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendanceData[dateStr] || {};
  };

  const getAttendanceColor = (attendance) => {
    const { present = 0, absent = 0, late = 0 } = attendance;
    const total = present + absent + late;
    
    if (total === 0) return "bg-slate-100";
    
    const presentRate = present / total;
    if (presentRate >= 0.9) return "bg-emerald-100 border-emerald-200";
    if (presentRate >= 0.7) return "bg-amber-100 border-amber-200";
    return "bg-red-100 border-red-200";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            icon="ChevronLeft"
            onClick={() => navigateMonth(-1)}
          />
          <Button
            size="sm"
            variant="ghost"
            icon="ChevronRight"
            onClick={() => navigateMonth(1)}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const attendance = getAttendanceForDate(day);
          const isSelected = selectedDate && format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
          const isCurrentMonth = isSameMonth(day, currentMonth);
          
          return (
            <motion.button
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(day)}
              className={cn(
                "aspect-square p-2 text-sm font-medium rounded-lg transition-all duration-200 border",
                isCurrentMonth ? "text-slate-900" : "text-slate-400",
                isSelected && "ring-2 ring-primary-500 ring-offset-1",
                isToday(day) && "bg-primary-600 text-white border-primary-600",
                !isToday(day) && getAttendanceColor(attendance),
                !isSelected && "hover:bg-slate-50"
              )}
            >
              <div className="space-y-1">
                <div>{format(day, "d")}</div>
                {Object.keys(attendance).length > 0 && !isToday(day) && (
                  <div className="flex justify-center">
                    <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60"></div>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-slate-50 rounded-lg"
        >
          <h4 className="font-medium text-slate-900 mb-3">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h4>
          
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant="outline"
              icon="Check"
              onClick={() => onMarkAttendance(selectedDate, "present")}
            >
              Mark Present
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon="X"
              onClick={() => onMarkAttendance(selectedDate, "absent")}
            >
              Mark Absent
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon="Clock"
              onClick={() => onMarkAttendance(selectedDate, "late")}
            >
              Mark Late
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AttendanceCalendar;