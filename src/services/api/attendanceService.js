import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByStudentId(studentId) {
    await delay(300);
    return attendance.filter(a => a.studentId === studentId.toString());
  },

  async getByDate(date) {
    await delay(300);
    const dateStr = date.toISOString().split('T')[0];
    return attendance.filter(a => a.date.startsWith(dateStr));
  },

  async create(attendanceData) {
    await delay(400);
    const maxId = Math.max(...attendance.map(a => a.Id), 0);
    const newRecord = {
      Id: maxId + 1,
      ...attendanceData
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(400);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance[index] = {
      ...attendance[index],
      ...attendanceData
    };
    return { ...attendance[index] };
  },

  async markAttendance(studentId, date, status, notes = "") {
    await delay(400);
    
    // Check if record already exists for this student and date
    const dateStr = date.toISOString().split('T')[0];
    const existingIndex = attendance.findIndex(a => 
      a.studentId === studentId.toString() && 
      a.date.startsWith(dateStr)
    );

    if (existingIndex !== -1) {
      // Update existing record
      attendance[existingIndex] = {
        ...attendance[existingIndex],
        status,
        notes
      };
      return { ...attendance[existingIndex] };
    } else {
      // Create new record
      const maxId = Math.max(...attendance.map(a => a.Id), 0);
      const newRecord = {
        Id: maxId + 1,
        studentId: studentId.toString(),
        date: date.toISOString(),
        status,
        notes
      };
      attendance.push(newRecord);
      return { ...newRecord };
    }
  },

  async bulkMarkAttendance(studentIds, date, status) {
    await delay(500);
    const results = [];
    
    for (const studentId of studentIds) {
      const result = await this.markAttendance(studentId, date, status);
      results.push(result);
    }
    
    return results;
  },

  async delete(id) {
    await delay(300);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance.splice(index, 1);
    return true;
  }
};