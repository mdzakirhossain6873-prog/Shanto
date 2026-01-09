
import React, { useState, useEffect } from 'react';
import { Student, ClassType, AttendanceRecord } from '../types';
import { CLASSES, getSectionsForClass, STORAGE_KEYS } from '../constants';

const AttendanceModule: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassType>('6th');
  const [selectedSection, setSelectedSection] = useState(getSectionsForClass('6th')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    setStudents(savedStudents.filter((s: Student) => s.class === selectedClass && s.section === selectedSection));
    setAttendance(JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]'));
  }, [selectedClass, selectedSection]);

  const toggleAttendance = (studentId: string) => {
    const existing = attendance.find(a => a.studentId === studentId && a.date === today);
    let newAttendance;
    
    if (existing) {
      newAttendance = attendance.filter(a => !(a.studentId === studentId && a.date === today));
    } else {
      newAttendance = [...attendance, {
        id: Math.random().toString(36).substr(2, 9),
        studentId,
        date: today,
        isPresent: true
      }];
    }
    
    setAttendance(newAttendance);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(newAttendance));
  };

  const isPresent = (studentId: string) => {
    return attendance.some(a => a.studentId === studentId && a.date === today && a.isPresent);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fas fa-check-double mr-3 text-indigo-600"></i> Daily Attendance
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <select 
          className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm outline-none"
          value={selectedClass}
          onChange={e => {
            const cls = e.target.value as ClassType;
            setSelectedClass(cls);
            setSelectedSection(getSectionsForClass(cls)[0]);
          }}
        >
          {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
        </select>
        <select 
          className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm outline-none"
          value={selectedSection}
          onChange={e => setSelectedSection(e.target.value)}
        >
          {getSectionsForClass(selectedClass).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date: {today}</span>
          <span className="text-xs font-bold text-indigo-600">{students.length} Students found</span>
        </div>
        
        <div className="divide-y divide-gray-50">
          {students.length > 0 ? students.map(s => {
            const present = isPresent(s.id);
            return (
              <div 
                key={s.id} 
                onClick={() => toggleAttendance(s.id)}
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50 active:bg-gray-100 ${present ? 'bg-green-50/30' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">#{s.rollNumber}</span>
                  <span className={`font-bold ${present ? 'text-green-600' : 'text-gray-700'}`}>{s.name}</span>
                </div>
                <div>
                  {present ? (
                    <div className="h-8 w-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-100 animate-in zoom-in duration-300">
                      <i className="fas fa-check"></i>
                    </div>
                  ) : (
                    <div className="h-8 w-8 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center text-gray-200">
                      <i className="fas fa-plus text-sm"></i>
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="p-10 text-center text-gray-400 italic text-sm">
              No students in this section.
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest italic">Tap student name to mark as present</p>
    </div>
  );
};

export default AttendanceModule;
