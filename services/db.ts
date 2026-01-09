
import { STORAGE_KEYS } from '../constants';
import { Student, Teacher, Staff, TimeTableEntry, AttendanceRecord, ClassLog, ChatMessage } from '../types';

/**
 * DatabaseService abstracts the data layer. 
 * Current Implementation: LocalStorage (Offline-First)
 * Future Implementation: Simply swap internal logic for Firebase Firestore SDK calls.
 */
export const DatabaseService = {
  // --- Teachers & Staff ---
  async getTeachers(): Promise<Teacher[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS) || '[]');
  },

  async saveTeachers(teachers: Teacher[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  async getStaff(): Promise<Staff[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF) || '[]');
  },

  async saveStaff(staff: Staff[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  },

  // --- Students ---
  async getStudents(): Promise<Student[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
  },

  async saveStudents(students: Student[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  // --- Attendance ---
  async getAttendance(): Promise<AttendanceRecord[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
  },

  async saveAttendance(records: AttendanceRecord[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  },

  // --- Logs & Timetable ---
  async getLogs(): Promise<ClassLog[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASS_LOGS) || '[]');
  },

  async saveLogs(logs: ClassLog[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.CLASS_LOGS, JSON.stringify(logs));
  },

  async getTimetable(): Promise<TimeTableEntry[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TIMETABLE) || '[]');
  },

  async saveTimetable(entries: TimeTableEntry[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(entries));
  },

  // --- School Info ---
  async getSchoolInfo(): Promise<{ name: string; accessCode: string } | null> {
    const data = localStorage.getItem(STORAGE_KEYS.SCHOOL_INFO);
    return data ? JSON.parse(data) : null;
  }
};
