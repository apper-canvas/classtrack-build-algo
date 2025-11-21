import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async getByStudentId(studentId) {
    await delay(300);
    return grades.filter(g => g.studentId === studentId.toString());
  },

  async getBySubject(subject) {
    await delay(300);
    return grades.filter(g => g.subject === subject);
  },

  async create(gradeData) {
    await delay(400);
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      Id: maxId + 1,
      ...gradeData
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(400);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = {
      ...grades[index],
      ...gradeData
    };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades.splice(index, 1);
    return true;
  },

  async calculateGPA(studentId, term = null) {
    await delay(200);
    const studentGrades = grades.filter(g => {
      const matchesStudent = g.studentId === studentId.toString();
      const matchesTerm = term ? g.term === term : true;
      return matchesStudent && matchesTerm;
    });

    if (studentGrades.length === 0) {
      return { gpa: 0, totalGrades: 0 };
    }

    const totalPoints = studentGrades.reduce((sum, grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
      let points = 0;
      if (percentage >= 90) points = 4.0;
      else if (percentage >= 80) points = 3.0;
      else if (percentage >= 70) points = 2.0;
      else if (percentage >= 60) points = 1.0;
      else points = 0.0;
      return sum + points;
    }, 0);

    const gpa = totalPoints / studentGrades.length;

    return {
      gpa: Math.round(gpa * 100) / 100,
      totalGrades: studentGrades.length
    };
  }
};