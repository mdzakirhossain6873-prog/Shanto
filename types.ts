
export enum UserRole {
  TEACHER = 'Teacher',
  STUDENT = 'Student'
}

export type ClassType = '6th' | '7th' | '8th' | '9th' | '10th';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  fatherName: string;
  parentMobile: string;
  class: ClassType;
  section: string;
  password?: string;
  photo?: string; // Base64 encoded string or URL
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: UserRole.TEACHER;
  isHeadmaster?: boolean;
  designation: string;
  contact: string;
  pin: string;
  status: 'APPROVED' | 'PENDING';
}

export interface Staff {
  id: string;
  name: string;
  designation: string;
  contact: string;
}

export interface TimeTableEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  class: ClassType;
  section: string;
  subject: string;
  teacherId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // ISO string YYYY-MM-DD
  isPresent: boolean;
}

export interface ClassLog {
  id: string;
  date: string;
  class: ClassType;
  section: string;
  subject: string;
  lessonSummary: string;
  homework: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}
