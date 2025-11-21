import { useState } from "react";
import { motion } from "framer-motion";
import StudentRow from "@/components/molecules/StudentRow";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const StudentTable = ({ 
  students, 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch = searchQuery === "" || 
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGrade = filterGrade === "" || student.gradeLevel === filterGrade;
      const matchesStatus = filterStatus === "" || student.status === filterStatus;
      
      return matchesSearch && matchesGrade && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.firstName.localeCompare(b.firstName);
        case "id":
          return a.studentId.localeCompare(b.studentId);
        case "grade":
          return a.gradeLevel.localeCompare(b.gradeLevel);
        case "enrollment":
          return new Date(a.enrollmentDate) - new Date(b.enrollmentDate);
        default:
          return 0;
      }
    });

  const gradeOptions = [
    { value: "1", label: "Grade 1" },
    { value: "2", label: "Grade 2" },
    { value: "3", label: "Grade 3" },
    { value: "4", label: "Grade 4" },
    { value: "5", label: "Grade 5" },
    { value: "6", label: "Grade 6" },
    { value: "7", label: "Grade 7" },
    { value: "8", label: "Grade 8" },
    { value: "9", label: "Grade 9" },
    { value: "10", label: "Grade 10" },
    { value: "11", label: "Grade 11" },
    { value: "12", label: "Grade 12" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" }
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "id", label: "Student ID" },
    { value: "grade", label: "Grade Level" },
    { value: "enrollment", label: "Enrollment Date" }
  ];

  if (loading) {
    return <Loading variant="table" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Students</h2>
          <p className="text-slate-600 mt-1">Manage student profiles and information</p>
        </div>
        
        <Button
          icon="Plus"
          onClick={onAdd}
          className="w-full sm:w-auto"
        >
          Add Student
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search students..."
            />
          </div>
          
          <Select
            label="Grade Level"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            options={gradeOptions}
            placeholder="All Grades"
          />
          
          <Select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={statusOptions}
            placeholder="All Status"
          />
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Sort by:</span>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
              className="w-40"
            />
          </div>
          
          <div className="text-sm text-slate-600">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredStudents.length === 0 ? (
          <Empty
            title="No students found"
            description={searchQuery || filterGrade || filterStatus 
              ? "Try adjusting your search or filter criteria" 
              : "Get started by adding your first student"}
            actionLabel={(!searchQuery && !filterGrade && !filterStatus) ? "Add First Student" : undefined}
            onAction={(!searchQuery && !filterGrade && !filterStatus) ? onAdd : undefined}
            icon="Users"
            className="min-h-[300px]"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((student, index) => (
                  <StudentRow
                    key={student.Id}
                    student={student}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentTable;