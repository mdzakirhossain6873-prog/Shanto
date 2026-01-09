
import React, { useState } from 'react';
import { Teacher } from '../types';
import StudentManagement from './StudentManagement';
import AttendanceModule from './AttendanceModule';
import ClassLogModule from './ClassLogModule';
import AdminModule from './AdminModule';

interface TeacherDashboardProps {
  user: Teacher;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'logs' | 'admin'>('students');

  // Fix: Explicitly type navItems to allow 'admin' tab ID for headmasters and avoid inference restrictions
  const navItems: { id: 'students' | 'attendance' | 'logs' | 'admin'; icon: string; label: string }[] = [
    { id: 'students', icon: 'fa-users', label: 'Students' },
    { id: 'attendance', icon: 'fa-calendar-check', label: 'Attendance' },
    { id: 'logs', icon: 'fa-book', label: 'Class Logs' },
  ];

  if (user.isHeadmaster) {
    navItems.push({ id: 'admin', icon: 'fa-user-shield', label: 'Admin' });
  }

  return (
    <div className="flex h-full bg-[#F7F9FF] overflow-hidden">
      {/* Web Sidebar (Desktop Only) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-6 z-20">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Main Menu</p>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-6">
          <div className="max-w-5xl mx-auto w-full">
            {activeTab === 'students' && <StudentManagement />}
            {activeTab === 'attendance' && <AttendanceModule />}
            {activeTab === 'logs' && <ClassLogModule isTeacher={true} userClass="" userSection="" />}
            {activeTab === 'admin' && user.isHeadmaster && <AdminModule />}
          </div>
        </div>

        {/* Mobile Bottom Nav (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center pt-2 pb-8 px-2 shadow-2xl z-50">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center flex-1 group"
            >
              <div className={`px-5 py-1 rounded-full transition-all mb-1 ${activeTab === item.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400'}`}>
                <i className={`fas ${item.icon} text-xl`}></i>
              </div>
              <span className={`text-[11px] font-bold ${activeTab === item.id ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TeacherDashboard;
