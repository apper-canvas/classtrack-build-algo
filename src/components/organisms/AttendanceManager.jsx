import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, startOfDay } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Attendance from "@/components/pages/Attendance";
import { attendanceService } from "@/services/attendanceService";
import AttendanceCalendar from "@/components/molecules/AttendanceCalendar";

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
    label: `${student.first_name_c} ${student.last_name_c} (${student.student_id_c})`
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
      const record = todayAttendance.find(a => 
        a.student_id_c?.Id === student.Id || a.student_id_c === student.Id
      );
      return {
        ...student,
        attendanceStatus: record?.status_c || null,
        attendanceId: record?.Id || null
      };
    });
  };

  const studentsWithAttendance = getStudentsWithAttendance();

const handleMarkAttendance = async (studentId, status) => {
    const student = studentsWithAttendance.find(s => s.Id.toString() === studentId);
    
    try {
      // Update existing record
      if (student?.attendanceId) {
        await attendanceService.update(student.attendanceId, {
          student_id_c: parseInt(studentId),
          date_c: selectedDate.toISOString(),
          status_c: status,
          notes_c: ""
        });
      } else {
        // Create new record
        await attendanceService.create({
          student_id_c: parseInt(studentId),
          date_c: selectedDate.toISOString(),
          status_c: status,
          notes_c: ""
        });
      }
      
      // Refresh attendance data if callback provided
      if (onMarkAttendance) {
        onMarkAttendance(studentId, status);
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error);
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
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {student.first_name_c?.[0]}{student.last_name_c?.[0]}
                  </span>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {student.first_name_c} {student.last_name_c}
                    </h4>
<p className="text-sm text-slate-500">
                      {student.student_id_c} • {student.grade_level_c} - {student.section_c}
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