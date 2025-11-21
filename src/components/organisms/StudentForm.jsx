import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const StudentForm = ({ 
  student, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
const [formData, setFormData] = useState({
    first_name_c: student?.first_name_c || "",
    last_name_c: student?.last_name_c || "",
    student_id_c: student?.student_id_c || "",
    email_c: student?.email_c || "",
    phone_c: student?.phone_c || "",
    enrollment_date_c: student?.enrollment_date_c ? format(new Date(student.enrollment_date_c), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    grade_level_c: student?.grade_level_c || "",
    section_c: student?.section_c || "",
    status_c: student?.status_c || "active"
  });

  const [errors, setErrors] = useState({});

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

  const sectionOptions = [
    { value: "A", label: "Section A" },
    { value: "B", label: "Section B" },
    { value: "C", label: "Section C" },
    { value: "D", label: "Section D" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" }
  ];

  const validateForm = () => {
    const newErrors = {};

if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }

    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }

    if (!formData.student_id_c.trim()) {
      newErrors.student_id_c = "Student ID is required";
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Email is invalid";
    }

    if (!formData.grade_level_c) {
      newErrors.grade_level_c = "Grade level is required";
    }

    if (!formData.section_c) {
      newErrors.section_c = "Section is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
...formData,
        enrollment_date_c: new Date(formData.enrollment_date_c).toISOString()
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

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
onSubmit={handleSubmit}
      className="space-y-6 overflow-y-auto max-h-96"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<Input
          label="First Name"
          value={formData.first_name_c}
          onChange={(e) => handleChange("first_name_c", e.target.value)}
          error={errors.first_name_c}
          placeholder="Enter first name"
        />

        <Input
          label="Last Name"
          value={formData.last_name_c}
          onChange={(e) => handleChange("last_name_c", e.target.value)}
          error={errors.last_name_c}
          placeholder="Enter last name"
        />

        <Input
          label="Student ID"
          value={formData.student_id_c}
          onChange={(e) => handleChange("student_id_c", e.target.value)}
          error={errors.student_id_c}
          placeholder="Enter student ID"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email_c}
          onChange={(e) => handleChange("email_c", e.target.value)}
          error={errors.email_c}
          placeholder="Enter email address"
        />

        <Input
          label="Phone"
          value={formData.phone_c}
          onChange={(e) => handleChange("phone_c", e.target.value)}
          placeholder="Enter phone number"
        />

        <Input
          label="Enrollment Date"
          type="date"
          value={formData.enrollment_date_c}
          onChange={(e) => handleChange("enrollment_date_c", e.target.value)}
        />

        <Select
          label="Grade Level"
          value={formData.grade_level_c}
          onChange={(e) => handleChange("grade_level_c", e.target.value)}
          options={gradeOptions}
          error={errors.grade_level_c}
          placeholder="Select grade level"
        />

        <Select
          label="Section"
          value={formData.section_c}
          onChange={(e) => handleChange("section_c", e.target.value)}
          options={sectionOptions}
          error={errors.section_c}
          placeholder="Select section"
        />

        <div className="md:col-span-2">
          <Select
            label="Status"
            value={formData.status_c}
            onChange={(e) => handleChange("status_c", e.target.value)}
            options={statusOptions}
          />
        </div>
      </div>

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
          {student ? "Save Changes" : "Save Student"}
        </Button>
      </div>
    </motion.form>
  );
};

export default StudentForm;