
import { ClassType } from './types';

export const CLASSES: ClassType[] = ['6th', '7th', '8th', '9th', '10th'];

export const SECTIONS_GENERAL = ["K-shakha", "Kh-shakha", "G-shakha", "Gh-shakha"];
export const SECTIONS_SPECIALIZED = ["Science", "Humanities", "Business Studies"];

export const getSectionsForClass = (className: ClassType): string[] => {
  if (['6th', '7th', '8th'].includes(className)) {
    return SECTIONS_GENERAL;
  }
  return SECTIONS_SPECIALIZED;
};

export const STORAGE_KEYS = {
  STUDENTS: 'edu_students',
  ATTENDANCE: 'edu_attendance',
  CLASS_LOGS: 'edu_class_logs',
  CHATS: 'edu_chats',
  AUTH_USER: 'edu_auth_user',
  STAFF: 'edu_staff',
  TEACHERS: 'edu_teachers',
  TIMETABLE: 'edu_timetable',
  SCHOOL_INFO: 'edu_school_info'
};

export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
