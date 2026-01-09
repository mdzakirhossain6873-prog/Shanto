
import { STORAGE_KEYS } from './constants';
import { Student } from './types';

export const initMockData = () => {
  const mockStudents: Student[] = [
    {
      id: 's1',
      name: 'John Doe',
      rollNumber: '1001',
      fatherName: 'Mr. Robert Doe',
      parentMobile: '555-0101',
      class: '6th',
      section: 'K-shakha',
      password: 'pass'
    },
    {
      id: 's2',
      name: 'Jane Smith',
      rollNumber: '1002',
      fatherName: 'Mr. Alan Smith',
      parentMobile: '555-0202',
      class: '9th',
      section: 'Science',
      password: 'pass'
    }
  ];

  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(mockStudents));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.CLASS_LOGS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify([]));
};
