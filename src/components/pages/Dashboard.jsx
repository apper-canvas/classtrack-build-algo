import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";
import { format, startOfWeek, endOfWeek } from "date-fns";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    averageGrade: 0,
    activeStudents: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get all data
      const [students, attendance, grades] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);

      // Calculate stats
      const totalStudents = students.length;
      const activeStudents = students.filter(s => s.status === "active").length;
      
      // Calculate attendance rate for this week
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      const thisWeekAttendance = attendance.filter(a => {
        const date = new Date(a.date);
        return date >= weekStart && date <= weekEnd;
      });
      
      const presentRecords = thisWeekAttendance.filter(a => a.status === "present").length;
      const attendanceRate = thisWeekAttendance.length > 0 
        ? Math.round((presentRecords / thisWeekAttendance.length) * 100)
        : 0;

      // Calculate average grade
      const totalScore = grades.reduce((sum, grade) => {
        return sum + (grade.score / grade.maxScore) * 100;
      }, 0);
      const averageGrade = grades.length > 0 ? Math.round(totalScore / grades.length) : 0;

      setDashboardData({
        totalStudents,
        attendanceRate,
        averageGrade,
        activeStudents
      });

      // Generate recent activity
      const activities = [
        ...grades.slice(-3).map(grade => ({
          id: grade.Id,
          type: "grade",
          message: `New ${grade.type} grade added for ${grade.subject}`,
          score: `${grade.score}/${grade.maxScore}`,
          time: format(new Date(grade.date), "MMM d, h:mm a")
        })),
        ...attendance.slice(-2).filter(a => a.status === "absent").map(a => ({
          id: a.Id,
          type: "absence",
          message: `Student marked absent`,
          time: format(new Date(a.date), "MMM d, h:mm a")
        }))
      ].slice(0, 5);

      setRecentActivity(activities);

    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: dashboardData.totalStudents,
      change: "+5 this month",
      changeType: "positive",
      icon: "Users",
      color: "primary"
    },
    {
      title: "Attendance Rate",
      value: `${dashboardData.attendanceRate}%`,
      change: "+2% from last week",
      changeType: "positive", 
      icon: "Calendar",
      color: "success"
    },
    {
      title: "Average Grade",
      value: `${dashboardData.averageGrade}%`,
      change: "B+ average",
      changeType: "neutral",
      icon: "BookOpen",
      color: "warning"
    },
    {
      title: "Active Students",
      value: dashboardData.activeStudents,
      change: "Currently enrolled",
      changeType: "neutral",
      icon: "UserCheck",
      color: "info"
    }
  ];

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadDashboardData} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
          Welcome to ClassTrack
        </h1>
        <p className="text-slate-600 text-lg">
          Your comprehensive student management dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
            <Button variant="ghost" size="sm" icon="MoreHorizontal" />
          </div>

          {recentActivity.length === 0 ? (
            <Empty
              title="No recent activity"
              description="Activity will appear here as you use the system"
              icon="Activity"
              className="min-h-[200px]"
            />
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === "grade" ? "bg-blue-100" : "bg-red-100"
                  }`}>
                    <ApperIcon 
                      name={activity.type === "grade" ? "BookOpen" : "AlertCircle"} 
                      className={`h-4 w-4 ${
                        activity.type === "grade" ? "text-blue-600" : "text-red-600"
                      }`}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.message}
                    </p>
                    {activity.score && (
                      <Badge variant="info" size="sm" className="mt-1">
                        {activity.score}
                      </Badge>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full justify-start h-auto p-4 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 hover:from-primary-100 hover:to-primary-200 border border-primary-200"
                icon="UserPlus"
              >
                <div className="text-left">
                  <div className="font-semibold">Add New Student</div>
                  <div className="text-sm opacity-75">Register a new student in the system</div>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full justify-start h-auto p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200"
                icon="Calendar"
              >
                <div className="text-left">
                  <div className="font-semibold">Mark Attendance</div>
                  <div className="text-sm opacity-75">Take attendance for today's classes</div>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full justify-start h-auto p-4 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 hover:from-amber-100 hover:to-amber-200 border border-amber-200"
                icon="BookOpen"
              >
                <div className="text-left">
                  <div className="font-semibold">Add Grades</div>
                  <div className="text-sm opacity-75">Record test scores and assignments</div>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full justify-start h-auto p-4 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 border border-blue-200"
                icon="FileText"
              >
                <div className="text-left">
                  <div className="font-semibold">Generate Reports</div>
                  <div className="text-sm opacity-75">Create progress and attendance reports</div>
                </div>
              </Button>
            </motion.div>
          </div>
        </Card>
      </div>

      {/* Today's Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Today's Overview</h2>
        <div className="text-center text-slate-600">
          <ApperIcon name="Calendar" className="h-12 w-12 mx-auto text-slate-400 mb-3" />
          <p className="text-lg font-medium">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          <p className="text-sm mt-2">Ready to start managing your students for today</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;