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
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    studentId: student?.studentId || "",
    email: student?.email || "",
    phone: student?.phone || "",
    enrollmentDate: student?.enrollmentDate ? format(new Date(student.enrollmentDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    gradeLevel: student?.gradeLevel || "",
    section: student?.section || "",
    status: student?.status || "active"
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.gradeLevel) {
      newErrors.gradeLevel = "Grade level is required";
    }

    if (!formData.section) {
      newErrors.section = "Section is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        enrollmentDate: new Date(formData.enrollmentDate).toISOString()
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
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          error={errors.firstName}
          placeholder="Enter first name"
        />

        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          error={errors.lastName}
          placeholder="Enter last name"
        />

        <Input
          label="Student ID"
          value={formData.studentId}
          onChange={(e) => handleChange("studentId", e.target.value)}
          error={errors.studentId}
          placeholder="Enter student ID"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          placeholder="Enter email address"
        />

        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Enter phone number"
        />

        <Input
          label="Enrollment Date"
          type="date"
          value={formData.enrollmentDate}
          onChange={(e) => handleChange("enrollmentDate", e.target.value)}
        />

        <Select
          label="Grade Level"
          value={formData.gradeLevel}
          onChange={(e) => handleChange("gradeLevel", e.target.value)}
          options={gradeOptions}
          error={errors.gradeLevel}
          placeholder="Select grade level"
        />

        <Select
          label="Section"
          value={formData.section}
          onChange={(e) => handleChange("section", e.target.value)}
          options={sectionOptions}
          error={errors.section}
          placeholder="Select section"
        />

        <div className="md:col-span-2">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
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