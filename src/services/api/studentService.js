import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('students_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "section_c"}},
          {"field": {"Name": "status_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById('students_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "section_c"}},
          {"field": {"Name": "status_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map form data to database fields
      const record = {
        Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        student_id_c: studentData.student_id_c,
        email_c: studentData.email_c,
        phone_c: studentData.phone_c,
        enrollment_date_c: studentData.enrollment_date_c,
        grade_level_c: studentData.grade_level_c,
        section_c: studentData.section_c,
        status_c: studentData.status_c
      };

      // Filter out undefined/null values
      const filteredRecord = Object.fromEntries(
        Object.entries(record).filter(([key, value]) => value !== undefined && value !== null && value !== "")
      );

      const response = await apperClient.createRecord('students_c', {
        records: [filteredRecord]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} student records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async update(id, studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map form data to database fields
      const record = {
        Id: parseInt(id),
        Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        student_id_c: studentData.student_id_c,
        email_c: studentData.email_c,
        phone_c: studentData.phone_c,
        enrollment_date_c: studentData.enrollment_date_c,
        grade_level_c: studentData.grade_level_c,
        section_c: studentData.section_c,
        status_c: studentData.status_c
      };

      // Filter out undefined/null values
      const filteredRecord = Object.fromEntries(
        Object.entries(record).filter(([key, value]) => value !== undefined && value !== null && value !== "")
      );

      const response = await apperClient.updateRecord('students_c', {
        records: [filteredRecord]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} student records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.deleteRecord('students_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} student records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error.message);
      return false;
    }
  }
};