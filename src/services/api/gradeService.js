import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

export const gradeService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('grades_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "term_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById('grades_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "term_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  },

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('grades_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "term_c"}}
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
      console.error("Error fetching grades by student:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getBySubject(subject) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('grades_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "term_c"}}
        ],
        where: [{
          "FieldName": "subject_c",
          "Operator": "EqualTo",
          "Values": [subject],
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
      console.error("Error fetching grades by subject:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async create(gradeData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map form data to database fields
      const record = {
        Name: gradeData.Name || `${gradeData.subject_c} - ${gradeData.type_c}`,
        student_id_c: parseInt(gradeData.student_id_c),
        subject_c: gradeData.subject_c,
        score_c: parseFloat(gradeData.score_c),
        max_score_c: parseFloat(gradeData.max_score_c),
        date_c: gradeData.date_c,
        type_c: gradeData.type_c,
        term_c: gradeData.term_c
      };

      // Filter out undefined/null values
      const filteredRecord = Object.fromEntries(
        Object.entries(record).filter(([key, value]) => value !== undefined && value !== null && value !== "")
      );

      const response = await apperClient.createRecord('grades_c', {
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
          console.error(`Failed to create ${failed.length} grade records: ${JSON.stringify(failed)}`);
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
      console.error("Error creating grade:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async update(id, gradeData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map form data to database fields
      const record = {
        Id: parseInt(id),
        Name: gradeData.Name || `${gradeData.subject_c} - ${gradeData.type_c}`,
        student_id_c: parseInt(gradeData.student_id_c),
        subject_c: gradeData.subject_c,
        score_c: parseFloat(gradeData.score_c),
        max_score_c: parseFloat(gradeData.max_score_c),
        date_c: gradeData.date_c,
        type_c: gradeData.type_c,
        term_c: gradeData.term_c
      };

      // Filter out undefined/null values
      const filteredRecord = Object.fromEntries(
        Object.entries(record).filter(([key, value]) => value !== undefined && value !== null && value !== "")
      );

      const response = await apperClient.updateRecord('grades_c', {
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
          console.error(`Failed to update ${failed.length} grade records: ${JSON.stringify(failed)}`);
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
      console.error("Error updating grade:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.deleteRecord('grades_c', {
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
          console.error(`Failed to delete ${failed.length} grade records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error.message);
      return false;
    }
  },

  async calculateGPA(studentId, term = null) {
    try {
      const grades = await this.getByStudentId(studentId);
      
      if (!grades || grades.length === 0) {
        return { gpa: 0, totalGrades: 0 };
      }

      const filteredGrades = term ? 
        grades.filter(g => g.term_c === term) : 
        grades;

      if (filteredGrades.length === 0) {
        return { gpa: 0, totalGrades: 0 };
      }

      const totalPoints = filteredGrades.reduce((sum, grade) => {
        const percentage = (grade.score_c / grade.max_score_c) * 100;
        let points = 0;
        if (percentage >= 90) points = 4.0;
        else if (percentage >= 80) points = 3.0;
        else if (percentage >= 70) points = 2.0;
        else if (percentage >= 60) points = 1.0;
        else points = 0.0;
        return sum + points;
      }, 0);

      const gpa = totalPoints / filteredGrades.length;

      return {
        gpa: Math.round(gpa * 100) / 100,
        totalGrades: filteredGrades.length
      };
    } catch (error) {
      console.error("Error calculating GPA:", error?.response?.data?.message || error.message);
      return { gpa: 0, totalGrades: 0 };
    }
}
};