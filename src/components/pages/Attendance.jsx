import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AttendanceManager from "@/components/organisms/AttendanceManager";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData.filter(s => s.status === "active"));
      setAttendance(attendanceData);
    } catch (err) {
      console.error("Error loading attendance data:", err);
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAttendance = async (attendanceId, attendanceData) => {
    try {
      if (attendanceId) {
        // Update existing record
await attendanceService.update(attendanceId, {
          student_id_c: parseInt(attendanceData.student_id_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c
        });
        toast.success("Attendance updated successfully!");
      } else {
        // Create new record
        await attendanceService.create({
          student_id_c: parseInt(attendanceData.student_id_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c
        });
        toast.success("Attendance marked successfully!");
      }
      
      // Reload attendance data
      const updatedAttendance = await attendanceService.getAll();
      setAttendance(updatedAttendance);
    } catch (err) {
      console.error("Error marking attendance:", err);
      toast.error(err.message || "Failed to mark attendance");
    }
  };

  const handleBulkAttendance = async (date, status) => {
    try {
const activeStudentIds = students.filter(s => s.status_c === "active").map(s => s.Id.toString());
      await attendanceService.bulkMarkAttendance(activeStudentIds, date, status);
      toast.success(`All students marked as ${status}!`);
      
      // Reload attendance data
      const updatedAttendance = await attendanceService.getAll();
      setAttendance(updatedAttendance);
    } catch (err) {
      console.error("Error with bulk attendance:", err);
      toast.error(err.message || "Failed to mark bulk attendance");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadData} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
          Attendance Management
        </h1>
        <p className="text-slate-600 text-lg">
          Track and manage student attendance efficiently
        </p>
      </div>

      <AttendanceManager
        students={students}
        attendance={attendance}
        onMarkAttendance={handleMarkAttendance}
        onBulkAttendance={handleBulkAttendance}
      />
    </motion.div>
  );
};

export default Attendance;