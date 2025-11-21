import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const GradeForm = ({ 
  students = [],
  grade,
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    studentId: grade?.studentId || "",
    subject: grade?.subject || "",
    score: grade?.score || "",
    maxScore: grade?.maxScore || "100",
    date: grade?.date ? format(new Date(grade.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    type: grade?.type || "",
    term: grade?.term || ""
  });

  const [errors, setErrors] = useState({});

  const subjectOptions = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "English", label: "English" },
    { value: "Science", label: "Science" },
    { value: "History", label: "History" },
    { value: "Geography", label: "Geography" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "Art", label: "Art" },
    { value: "Music", label: "Music" },
    { value: "Computer Science", label: "Computer Science" }
  ];

  const typeOptions = [
    { value: "quiz", label: "Quiz" },
    { value: "test", label: "Test" },
    { value: "assignment", label: "Assignment" },
    { value: "project", label: "Project" },
    { value: "exam", label: "Exam" }
  ];

  const termOptions = [
    { value: "1st Quarter", label: "1st Quarter" },
    { value: "2nd Quarter", label: "2nd Quarter" },
    { value: "3rd Quarter", label: "3rd Quarter" },
    { value: "4th Quarter", label: "4th Quarter" },
    { value: "Mid-term", label: "Mid-term" },
    { value: "Final", label: "Final" }
  ];

  const studentOptions = students.map(student => ({
    value: student.Id.toString(),
    label: `${student.firstName} ${student.lastName} (${student.studentId})`
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId) {
      newErrors.studentId = "Student is required";
    }

    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.score) {
      newErrors.score = "Score is required";
    } else if (isNaN(formData.score) || formData.score < 0) {
      newErrors.score = "Score must be a valid positive number";
    } else if (parseFloat(formData.score) > parseFloat(formData.maxScore)) {
      newErrors.score = "Score cannot exceed maximum score";
    }

    if (!formData.maxScore) {
      newErrors.maxScore = "Maximum score is required";
    } else if (isNaN(formData.maxScore) || formData.maxScore <= 0) {
      newErrors.maxScore = "Maximum score must be a valid positive number";
    }

    if (!formData.type) {
      newErrors.type = "Assessment type is required";
    }

    if (!formData.term) {
      newErrors.term = "Term is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        score: parseFloat(formData.score),
        maxScore: parseFloat(formData.maxScore),
        date: new Date(formData.date).toISOString()
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const percentage = formData.score && formData.maxScore 
    ? ((parseFloat(formData.score) / parseFloat(formData.maxScore)) * 100).toFixed(1)
    : 0;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Select
            label="Student"
            value={formData.studentId}
            onChange={(e) => handleChange("studentId", e.target.value)}
            options={studentOptions}
            error={errors.studentId}
            placeholder="Select student"
          />
        </div>

        <Select
          label="Subject"
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          options={subjectOptions}
          error={errors.subject}
          placeholder="Select subject"
        />

        <Select
          label="Assessment Type"
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
          options={typeOptions}
          error={errors.type}
          placeholder="Select type"
        />

        <Input
          label="Score"
          type="number"
          value={formData.score}
          onChange={(e) => handleChange("score", e.target.value)}
          error={errors.score}
          placeholder="Enter score"
          min="0"
          step="0.1"
        />

        <Input
          label="Maximum Score"
          type="number"
          value={formData.maxScore}
          onChange={(e) => handleChange("maxScore", e.target.value)}
          error={errors.maxScore}
          placeholder="Enter max score"
          min="1"
          step="0.1"
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />

        <Select
          label="Term"
          value={formData.term}
          onChange={(e) => handleChange("term", e.target.value)}
          options={termOptions}
          error={errors.term}
          placeholder="Select term"
        />
      </div>

      {/* Score Preview */}
      {formData.score && formData.maxScore && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200"
        >
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-primary-900">Score Preview</h4>
            <div className="text-2xl font-bold text-primary-700">
              {formData.score}/{formData.maxScore} ({percentage}%)
            </div>
            <p className="text-sm text-primary-600">
              Grade: {percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F"}
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          loading={loading}
        >
          {grade ? "Update Grade" : "Add Grade"}
        </Button>
      </div>
    </motion.form>
  );
};

export default GradeForm;