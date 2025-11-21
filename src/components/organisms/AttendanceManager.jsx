import { useState } from "react";
import { motion } from "framer-motion";
import { format, startOfDay } from "date-fns";
import AttendanceCalendar from "@/components/molecules/AttendanceCalendar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const AttendanceManager = ({ 
  students = [], 
  attendance = [], 
  onMarkAttendance,
  onBulkAttendance 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStudent, setSelectedStudent] = useState("");
  const [bulkStatus, setBulkStatus] = useState("present");

  const studentOptions = students.map(student => ({
    value: student.Id.toString(),
    label: `${student.firstName} ${student.lastName} (${student.studentId})`
  }));

  const statusOptions = [
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
    { value: "late", label: "Late" },
    { value: "excused", label: "Excused" }
  ];

  // Get attendance for selected date
  const getAttendanceForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendance.filter(record => 
      format(new Date(record.date), "yyyy-MM-dd") === dateStr
    );
  };

  // Get attendance summary for calendar
  const getAttendanceSummary = () => {
    const summary = {};
    attendance.forEach(record => {
      const dateStr = format(new Date(record.date), "yyyy-MM-dd");
      if (!summary[dateStr]) {
        summary[dateStr] = { present: 0, absent: 0, late: 0, excused: 0 };
      }
      summary[dateStr][record.status]++;
    });
    return summary;
  };

  const todayAttendance = getAttendanceForDate(selectedDate);
  const attendanceSummary = getAttendanceSummary();

  // Get students with their attendance status for selected date
  const getStudentsWithAttendance = () => {
    return students.map(student => {
      const record = todayAttendance.find(a => a.studentId === student.Id.toString());
      return {
        ...student,
        attendanceStatus: record?.status || null,
        attendanceId: record?.Id || null
      };
    });
  };

  const studentsWithAttendance = getStudentsWithAttendance();

  const handleMarkAttendance = (studentId, status) => {
    const student = studentsWithAttendance.find(s => s.Id.toString() === studentId);
    
    if (student?.attendanceId) {
      // Update existing record
      onMarkAttendance(student.attendanceId, {
        studentId,
        date: selectedDate.toISOString(),
        status,
        notes: ""
      });
    } else {
      // Create new record
      onMarkAttendance(null, {
        studentId,
        date: selectedDate.toISOString(),
        status,
        notes: ""
      });
    }
  };

  const handleBulkAttendance = () => {
    if (bulkStatus) {
      onBulkAttendance(selectedDate, bulkStatus);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "success";
      case "absent":
        return "error";
      case "late":
        return "warning";
      case "excused":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return "Check";
      case "absent":
        return "X";
      case "late":
        return "Clock";
      case "excused":
        return "Shield";
      default:
        return "Minus";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <AttendanceCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          attendanceData={attendanceSummary}
          onMarkAttendance={(date, status) => {
            // This could be used for quick calendar marking
            setSelectedDate(date);
          }}
        />

        {/* Daily Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Daily Summary - {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: "Present", count: todayAttendance.filter(a => a.status === "present").length, color: "success" },
              { label: "Absent", count: todayAttendance.filter(a => a.status === "absent").length, color: "error" },
              { label: "Late", count: todayAttendance.filter(a => a.status === "late").length, color: "warning" },
              { label: "Excused", count: todayAttendance.filter(a => a.status === "excused").length, color: "info" }
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{stat.count}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bulk Actions */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Bulk Actions</h4>
            <div className="flex space-x-3">
              <Select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                options={statusOptions}
                className="flex-1"
              />
              <Button
                onClick={handleBulkAttendance}
                variant="outline"
                size="sm"
              >
                Mark All
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Student List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Student Attendance - {format(selectedDate, "MMM d, yyyy")}
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {studentsWithAttendance.map((student) => (
            <motion.div
              key={student.Id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-6 py-4 hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {student.firstName[0]}{student.lastName[0]}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {student.firstName} {student.lastName}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {student.studentId} • Grade {student.gradeLevel} - {student.section}
                    </p>
                  </div>
                  
                  {student.attendanceStatus && (
                    <Badge variant={getStatusColor(student.attendanceStatus)}>
                      <ApperIcon name={getStatusIcon(student.attendanceStatus)} className="h-3 w-3 mr-1" />
                      {student.attendanceStatus}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={student.attendanceStatus === option.value ? "primary" : "ghost"}
                      onClick={() => handleMarkAttendance(student.Id.toString(), option.value)}
                      className="px-3"
                    >
                      <ApperIcon name={getStatusIcon(option.value)} className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AttendanceManager;