import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import GradeForm from "@/components/organisms/GradeForm";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formLoading, setFormLoading] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setGrades(gradesData);
    } catch (err) {
      console.error("Error loading grades data:", err);
      setError(err.message || "Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Get student name by ID
  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id.toString() === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  // Get student by ID
  const getStudent = (studentId) => {
    return students.find(s => s.Id.toString() === studentId);
  };

  // Filter grades
  const filteredGrades = grades.filter(grade => {
    const student = getStudent(grade.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : "";
    const studentId = student ? student.studentId : "";
    
    const matchesSearch = searchQuery === "" ||
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStudent = filterStudent === "" || grade.studentId === filterStudent;
    const matchesSubject = filterSubject === "" || grade.subject === filterSubject;
    const matchesTerm = filterTerm === "" || grade.term === filterTerm;
    
    return matchesSearch && matchesStudent && matchesSubject && matchesTerm;
  });

  // Options for filters
  const studentOptions = students.map(student => ({
    value: student.Id.toString(),
    label: `${student.firstName} ${student.lastName} (${student.studentId})`
  }));

  const subjectOptions = [...new Set(grades.map(g => g.subject))].map(subject => ({
    value: subject,
    label: subject
  }));

  const termOptions = [...new Set(grades.map(g => g.term))].map(term => ({
    value: term,
    label: term
  }));

  const handleAddGrade = () => {
    setSelectedGrade(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditGrade = (grade) => {
    setSelectedGrade(grade);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteGrade = (grade) => {
    setSelectedGrade(grade);
    setModalMode("delete");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (modalMode === "add") {
        await gradeService.create(formData);
        toast.success("Grade added successfully!");
      } else if (modalMode === "edit") {
        await gradeService.update(selectedGrade.Id, formData);
        toast.success("Grade updated successfully!");
      }
      
      await loadData();
      setIsModalOpen(false);
      setSelectedGrade(null);
    } catch (err) {
      console.error("Error saving grade:", err);
      toast.error(err.message || "Failed to save grade");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGrade) return;
    
    try {
      setFormLoading(true);
      await gradeService.delete(selectedGrade.Id);
      toast.success("Grade deleted successfully!");
      await loadData();
      setIsModalOpen(false);
      setSelectedGrade(null);
    } catch (err) {
      console.error("Error deleting grade:", err);
      toast.error(err.message || "Failed to delete grade");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGrade(null);
    setFormLoading(false);
  };

  const getGradeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 70) return "warning";
    if (percentage >= 60) return "info";
    return "error";
  };

  const getGradeLetter = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case "add":
        return "Add New Grade";
      case "edit":
        return "Edit Grade";
      case "delete":
        return "Delete Grade";
      default:
        return "Grade";
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Grades Management</h2>
          <p className="text-slate-600 mt-1">Record and manage student grades</p>
        </div>
        
        <Button
          icon="Plus"
          onClick={handleAddGrade}
          className="w-full sm:w-auto"
        >
          Add Grade
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2 lg:col-span-1">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search grades..."
            />
          </div>
          
          <Select
            label="Student"
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            options={studentOptions}
            placeholder="All Students"
          />
          
          <Select
            label="Subject"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            options={subjectOptions}
            placeholder="All Subjects"
          />
          
          <Select
            label="Term"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            options={termOptions}
            placeholder="All Terms"
          />
        </div>
        
        <div className="text-sm text-slate-600">
          Showing {filteredGrades.length} of {grades.length} grades
        </div>
      </Card>

      {/* Grades List */}
      <Card className="overflow-hidden">
        {filteredGrades.length === 0 ? (
          <Empty
            title="No grades found"
            description={searchQuery || filterStudent || filterSubject || filterTerm 
              ? "Try adjusting your search or filter criteria" 
              : "Get started by adding your first grade"}
            actionLabel={(!searchQuery && !filterStudent && !filterSubject && !filterTerm) ? "Add First Grade" : undefined}
            onAction={(!searchQuery && !filterStudent && !filterSubject && !filterTerm) ? handleAddGrade : undefined}
            icon="BookOpen"
            className="min-h-[400px]"
          />
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredGrades.map((grade, index) => (
              <motion.div
                key={grade.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {getGradeLetter(grade.score, grade.maxScore)}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {getStudentName(grade.studentId)}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {grade.subject} • {grade.type} • {grade.term}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(new Date(grade.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">
                        {grade.score}/{grade.maxScore}
                      </div>
                      <Badge variant={getGradeColor(grade.score, grade.maxScore)} size="sm">
                        {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Edit"
                        onClick={() => handleEditGrade(grade)}
                        className="text-slate-600 hover:text-primary-600"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Trash2"
                        onClick={() => handleDeleteGrade(grade)}
                        className="text-slate-600 hover:text-red-600"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen && (modalMode === "add" || modalMode === "edit")}
        onClose={handleCloseModal}
        title={getModalTitle()}
        size="lg"
      >
        <GradeForm
          students={students}
          grade={selectedGrade}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isModalOpen && modalMode === "delete"}
        onClose={handleCloseModal}
        title={getModalTitle()}
        size="md"
      >
        {selectedGrade && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Are you sure you want to delete this grade?
              </h3>
              <div className="text-slate-600 space-y-2">
                <p><strong>Student:</strong> {getStudentName(selectedGrade.studentId)}</p>
                <p><strong>Subject:</strong> {selectedGrade.subject}</p>
                <p><strong>Score:</strong> {selectedGrade.score}/{selectedGrade.maxScore}</p>
                <p className="text-sm text-red-600 mt-3">This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={formLoading}
              >
                Delete Grade
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Grades;