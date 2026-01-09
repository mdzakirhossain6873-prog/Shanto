
import React from 'react';
import { Teacher, Student } from '../types';

interface HeaderProps {
  user: Teacher | Student;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const isTeacher = 'email' in user;
  const student = !isTeacher ? (user as Student) : null;
  
  return (
    <header className="bg-white text-gray-800 px-4 pt-10 pb-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center overflow-hidden border border-indigo-100 shadow-inner">
          {student?.photo ? (
            <img src={student.photo} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <i className={`fas ${isTeacher ? 'fa-chalkboard-teacher' : 'fa-user-graduate'} text-indigo-500 text-xl`}></i>
          )}
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">{user.name}</h1>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
            {isTeacher ? 'Administrator' : `Roll #${student?.rollNumber}`}
          </p>
        </div>
      </div>
      <button 
        onClick={onLogout}
        className="h-10 w-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all android-ripple"
      >
        <i className="fas fa-power-off"></i>
      </button>
    </header>
  );
};

export default Header;
