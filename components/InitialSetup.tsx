
import React, { useState } from 'react';
import { Teacher, UserRole } from '../types';
import { STORAGE_KEYS } from '../constants';

interface InitialSetupProps {
  onComplete: (headmaster: Teacher) => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onComplete }) => {
  const [schoolName, setSchoolName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [headmasterName, setHeadmasterName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accessCode.length !== 6 || !/^\d+$/.test(accessCode)) {
      setError('Access Code must be exactly 6 digits.');
      return;
    }

    const headmaster: Teacher = {
      id: 'hm-' + Date.now(),
      name: headmasterName,
      email,
      role: UserRole.TEACHER,
      isHeadmaster: true,
      designation: 'Headmaster',
      contact,
      pin,
      status: 'APPROVED'
    };

    localStorage.setItem(STORAGE_KEYS.SCHOOL_INFO, JSON.stringify({ 
      name: schoolName, 
      accessCode: accessCode 
    }));
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify([headmaster]));
    
    onComplete(headmaster);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#F7F9FF] px-4 py-10">
      <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-indigo-100 border border-white animate-in zoom-in duration-300">
        <div className="mb-10 text-center">
          <div className="h-20 w-20 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-100 mb-6 mx-auto">
            <i className="fas fa-university"></i>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">School Registration</h1>
          <p className="text-gray-400 font-medium">Administrative Master Account Setup</p>
        </div>

        <form onSubmit={handleSetup} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Institution Name</label>
              <input 
                required 
                className="w-full px-6 py-4 bg-[#F7F9FF] border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700"
                placeholder="e.g. Dhaka International School"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-4 mb-1 block">School Access Code (6 Digits)</label>
              <input 
                required 
                maxLength={6}
                className="w-full px-6 py-4 bg-indigo-50 border-2 border-indigo-200 focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-mono font-black text-center text-xl tracking-[0.5em] text-indigo-700"
                placeholder="000000"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              <p className="text-[9px] text-gray-400 mt-2 ml-4 font-bold uppercase italic">This code is required for all students and staff to log in.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Headmaster Name</label>
                <input 
                  required 
                  className="w-full px-6 py-4 bg-[#F7F9FF] border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700"
                  placeholder="Full Name"
                  value={headmasterName}
                  onChange={(e) => setHeadmasterName(e.target.value)}
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Master PIN</label>
                <input 
                  required 
                  type="password"
                  className="w-full px-6 py-4 bg-[#F7F9FF] border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700"
                  placeholder="Secret PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Official Email</label>
              <input 
                required 
                type="email"
                className="w-full px-6 py-4 bg-[#F7F9FF] border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700"
                placeholder="admin@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-black text-center uppercase tracking-widest">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-indigo-100 transition-all active:scale-95 text-lg"
          >
            Create Master Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitialSetup;
