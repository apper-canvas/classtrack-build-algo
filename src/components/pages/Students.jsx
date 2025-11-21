import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add, edit, view, delete
  const [formLoading, setFormLoading] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("delete");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (modalMode === "add") {
        await studentService.create(formData);
        toast.success("Student added successfully!");
      } else if (modalMode === "edit") {
        await studentService.update(selectedStudent.Id, formData);
        toast.success("Student updated successfully!");
      }
      
      await loadStudents();
      setIsModalOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error saving student:", err);
      toast.error(err.message || "Failed to save student");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    
    try {
      setFormLoading(true);
      await studentService.delete(selectedStudent.Id);
      toast.success("Student deleted successfully!");
      await loadStudents();
      setIsModalOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error deleting student:", err);
      toast.error(err.message || "Failed to delete student");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFormLoading(false);
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case "add":
        return "Add New Student";
      case "edit":
        return "Edit Student";
      case "view":
        return "Student Details";
      case "delete":
        return "Delete Student";
      default:
        return "Student";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadStudents} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <StudentTable
        students={students}
        loading={loading}
        onView={handleViewStudent}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        onAdd={handleAddStudent}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen && (modalMode === "add" || modalMode === "edit")}
        onClose={handleCloseModal}
        title={getModalTitle()}
        size="lg"
      >
        <StudentForm
          student={selectedStudent}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isModalOpen && modalMode === "view"}
        onClose={handleCloseModal}
        title={getModalTitle()}
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-slate-600">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Student ID</label>
                <p className="mt-1 text-sm text-slate-900">{selectedStudent.studentId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone</label>
                <p className="mt-1 text-sm text-slate-900">{selectedStudent.phone || "Not provided"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Grade Level</label>
                <p className="mt-1 text-sm text-slate-900">Grade {selectedStudent.gradeLevel}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Section</label>
                <p className="mt-1 text-sm text-slate-900">{selectedStudent.section}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Enrollment Date</label>
                <p className="mt-1 text-sm text-slate-900">
                  {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <p className="mt-1 text-sm text-slate-900 capitalize">{selectedStudent.status}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button onClick={() => handleEditStudent(selectedStudent)}>
                Edit Student
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isModalOpen && modalMode === "delete"}
        onClose={handleCloseModal}
        title={getModalTitle()}
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Are you sure you want to delete this student?
              </h3>
              <p className="text-slate-600">
                This will permanently delete <strong>{selectedStudent.firstName} {selectedStudent.lastName}</strong> and all associated records. This action cannot be undone.
              </p>
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
                Delete Student
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Students;