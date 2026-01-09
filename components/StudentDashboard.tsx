
import React, { useState } from 'react';
import { Student, AttendanceRecord } from '../types';
import { STORAGE_KEYS } from '../constants';
import ChatModule from './ChatModule';
import ClassLogModule from './ClassLogModule';

interface StudentDashboardProps {
  user: Student;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'logs'>('home');

  const attendance: AttendanceRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
  const myAttendance = attendance.filter(a => a.studentId === user.id && a.isPresent);

  const navItems = [
    { id: 'home' as const, icon: 'fa-home', label: 'Home' },
    { id: 'logs' as const, icon: 'fa-book-reader', label: 'Lessons' },
    { id: 'messages' as const, icon: 'fa-comments', label: 'Messages' },
  ];

  return (
    <div className="flex h-full bg-[#F7F9FF] overflow-hidden">
      {/* Web Sidebar (Desktop Only) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-6 z-20">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Student Portal</p>
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

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-6">
          <div className="max-w-4xl mx-auto w-full">
            {activeTab === 'home' && (
              <div className="p-4 md:p-8 space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-2xl font-black mb-1 tracking-tight">Hi, {user.name.split(' ')[0]}!</h3>
                      <p className="text-indigo-100 text-sm font-medium">Class {user.class} • {user.section}</p>
                    </div>
                    <div className="h-20 w-20 rounded-3xl border-4 border-white/20 overflow-hidden shadow-2xl">
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-indigo-400 flex items-center justify-center font-bold text-2xl uppercase">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-10 flex items-center justify-between bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10 relative z-10">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-200 mb-1">Attendance Record</p>
                      <p className="text-4xl font-black">{myAttendance.length} <span className="text-sm font-medium opacity-60">Days Present</span></p>
                    </div>
                    <div className="p-4 bg-white/20 rounded-2xl">
                      <i className="fas fa-calendar-check text-2xl text-white"></i>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <section>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Attendance Timeline</h4>
                    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm divide-y divide-gray-50">
                      {myAttendance.length > 0 ? myAttendance.map(a => (
                        <div key={a.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <span className="font-bold text-gray-700 text-sm">{new Date(a.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                          <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">Present</span>
                        </div>
                      )) : (
                        <div className="p-12 text-center text-gray-400">
                          <i className="fas fa-calendar-alt text-4xl mb-4 opacity-10"></i>
                          <p className="text-sm font-medium">No records found</p>
                        </div>
                      )}
                    </div>
                  </section>
                  
                  <section className="hidden md:block">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setActiveTab('logs')} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center space-y-3 hover:border-indigo-400 transition-all">
                        <i className="fas fa-book-open text-2xl text-indigo-500"></i>
                        <span className="text-xs font-bold text-gray-600">View Lessons</span>
                      </button>
                      <button onClick={() => setActiveTab('messages')} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center space-y-3 hover:border-indigo-400 transition-all">
                        <i className="fas fa-comments text-2xl text-indigo-500"></i>
                        <span className="text-xs font-bold text-gray-600">Open Chat</span>
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'logs' && <ClassLogModule isTeacher={false} userClass={user.class} userSection={user.section} />}
            {activeTab === 'messages' && <ChatModule currentUser={user} />}
          </div>
        </div>

        {/* Mobile Nav */}
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

export default StudentDashboard;
