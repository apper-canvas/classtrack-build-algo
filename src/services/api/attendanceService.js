import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const attendanceService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance records:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById('attendance_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance record ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  },

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "student_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(studentId)],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by student:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getByDate(date) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const dateStr = date.toISOString().split('T')[0];

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "StartsWith",
          "Values": [dateStr],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map form data to database fields
      const record = {
        Name: attendanceData.Name || `Attendance - ${attendanceData.date_c}`,
        student_id_c: parseInt(attendanceData.student_id_c),
        date_c: attendanceData.date_c,
        status_c: attendanceData.status_c,
        notes_c: attendanceData.notes_c
      };

      // Filter out undefined/null values
      const filteredRecord = Object.fromEntries(
        Object.entries(record).filter(([key, value]) => value !== undefined && value !== null && value !== "")
      );

      const response = await apperClient.createRecord('attendance_c', {
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
          console.error(`Failed to create ${failed.length} attendance records: ${JSON.stringify(failed)}`);
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
      console.error("Error creating attendance record:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async update(id, attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map form data to database fields
      const record = {
        Id: parseInt(id),
        Name: attendanceData.Name || `Attendance - ${attendanceData.date_c}`,
        student_id_c: parseInt(attendanceData.student_id_c),
        date_c: attendanceData.date_c,
        status_c: attendanceData.status_c,
        notes_c: attendanceData.notes_c
      };

      // Filter out undefined/null values
      const filteredRecord = Object.fromEntries(
        Object.entries(record).filter(([key, value]) => value !== undefined && value !== null && value !== "")
      );

      const response = await apperClient.updateRecord('attendance_c', {
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
          console.error(`Failed to update ${failed.length} attendance records: ${JSON.stringify(failed)}`);
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
      console.error("Error updating attendance record:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async markAttendance(studentId, date, status, notes = "") {
    try {
      // Check if record already exists for this student and date
      const existingRecords = await this.getByDate(new Date(date));
      const existingRecord = existingRecords.find(a => 
        a.student_id_c?.Id === parseInt(studentId) || 
        a.student_id_c === parseInt(studentId)
      );

      if (existingRecord) {
        // Update existing record
        return await this.update(existingRecord.Id, {
          Name: `Attendance - ${date}`,
          student_id_c: parseInt(studentId),
          date_c: date,
          status_c: status,
          notes_c: notes
        });
      } else {
        // Create new record
        return await this.create({
          Name: `Attendance - ${date}`,
          student_id_c: parseInt(studentId),
          date_c: date,
          status_c: status,
          notes_c: notes
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async bulkMarkAttendance(studentIds, date, status) {
    try {
      const results = [];
      
      for (const studentId of studentIds) {
        const result = await this.markAttendance(studentId, date, status);
        if (result) {
          results.push(result);
        }
      }
      
      return results;
    } catch (error) {
      console.error("Error bulk marking attendance:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.deleteRecord('attendance_c', {
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
          console.error(`Failed to delete ${failed.length} attendance records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting attendance record:", error?.response?.data?.message || error.message);
      return false;
    }
  }
};