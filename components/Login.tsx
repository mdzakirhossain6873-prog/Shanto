
import React, { useState, useEffect } from 'react';
import { UserRole, Teacher, Student } from '../types';
import { STORAGE_KEYS } from '../constants';

interface LoginProps {
  onLogin: (user: Teacher | Student) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'discovery' | 'auth' | 'register-staff'>('discovery');
  const [schoolCode, setSchoolCode] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TEACHER);
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [schoolInfo, setSchoolInfo] = useState<{ name: string; accessCode: string } | null>(null);

  // Registration states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regDesignation, setRegDesignation] = useState('');
  const [regContact, setRegContact] = useState('');

  useEffect(() => {
    const savedInfo = localStorage.getItem(STORAGE_KEYS.SCHOOL_INFO);
    if (savedInfo) {
      setSchoolInfo(JSON.parse(savedInfo));
    }
  }, []);

  const handleDiscovery = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (schoolInfo && schoolCode === schoolInfo.accessCode) {
      setStep('auth');
    } else {
      setError('Invalid School Access Code');
      const el = document.getElementById('discovery-form');
      el?.classList.add('animate-shake');
      setTimeout(() => el?.classList.remove('animate-shake'), 400);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === UserRole.TEACHER) {
      const teachers: Teacher[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS) || '[]');
      const teacher = teachers.find(t => t.email.toLowerCase() === email.toLowerCase() && t.pin === password);
      
      if (teacher) {
        if (teacher.status === 'PENDING') {
          setError('Account pending approval by Headmaster.');
        } else {
          onLogin(teacher);
        }
      } else {
        setError('Invalid Email or PIN');
      }
    } else {
      const students: Student[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
      const student = students.find(s => s.rollNumber === rollNumber && s.password === password);
      if (student) onLogin(student);
      else setError('Invalid credentials');
    }
  };

  const handleStaffRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const teachers: Teacher[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS) || '[]');
    if (teachers.some(t => t.email.toLowerCase() === regEmail.toLowerCase())) {
      setError('Email already exists.');
      return;
    }

    const newTeacher: Teacher = {
      id: 't-' + Date.now(),
      name: regName,
      email: regEmail,
      role: UserRole.TEACHER,
      designation: regDesignation,
      contact: regContact,
      pin: regPin,
      status: 'PENDING'
    };

    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify([...teachers, newTeacher]));
    setSuccess('Registration submitted! Please wait for Headmaster approval.');
    setTimeout(() => {
      setSuccess('');
      setStep('auth');
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#F7F9FF] px-4 py-10 overflow-hidden">
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-indigo-100 border border-white relative">
        
        {step === 'discovery' && (
          <div className="animate-in fade-in slide-in-from-right duration-500">
            <div className="mb-10 text-center">
              <div className="h-16 w-16 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-100 mb-6 mx-auto">
                <i className="fas fa-search-location"></i>
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Locate School</h1>
              <p className="text-gray-400 font-medium text-sm">Enter your 6-digit School Access Code</p>
            </div>

            <form id="discovery-form" onSubmit={handleDiscovery} className="space-y-6">
              <div className="group">
                <input 
                  type="text" 
                  maxLength={6}
                  required 
                  autoFocus
                  className="w-full px-6 py-6 bg-[#F7F9FF] border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[28px] outline-none transition-all font-mono font-black text-center text-3xl tracking-[0.5em] text-indigo-700"
                  placeholder="000000"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>

              {error && (
                <div className="bg-red-50 p-4 rounded-2xl flex items-center space-x-3 text-red-600">
                  <i className="fas fa-exclamation-circle"></i>
                  <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-indigo-100 transition-all active:scale-95 hover:bg-indigo-700 flex items-center justify-center space-x-3"
              >
                <span>Find School</span>
                <i className="fas fa-arrow-right text-sm"></i>
              </button>
            </form>
          </div>
        )}

        {step === 'auth' && (
          <div className="animate-in fade-in slide-in-from-right duration-500">
            <div className="mb-8 text-center md:text-left">
              <div className="flex items-center space-x-3 mb-6">
                <button onClick={() => setStep('discovery')} className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-indigo-600">
                  <i className="fas fa-arrow-left"></i>
                </button>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {schoolInfo?.name}
                </div>
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Sign In</h1>
              <p className="text-gray-400 font-medium">Please enter your credentials</p>
            </div>

            <div className="bg-[#F7F9FF] p-1.5 rounded-2xl flex mb-8">
              <button 
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === UserRole.TEACHER ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}
                onClick={() => setRole(UserRole.TEACHER)}
              >
                Staff
              </button>
              <button 
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === UserRole.STUDENT ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}
                onClick={() => setRole(UserRole.STUDENT)}
              >
                Student
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="group">
                  <input 
                    type={role === UserRole.TEACHER ? "email" : "text"} 
                    required 
                    className="w-full px-5 py-4 bg-[#F7F9FF] border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-700"
                    placeholder={role === UserRole.TEACHER ? "Email Address" : "Roll Number"}
                    value={role === UserRole.TEACHER ? email : rollNumber}
                    onChange={(e) => role === UserRole.TEACHER ? setEmail(e.target.value) : setRollNumber(e.target.value)}
                  />
                </div>

                <div className="group">
                  <input 
                    type="password" 
                    required 
                    className="w-full px-5 py-4 bg-[#F7F9FF] border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-700"
                    placeholder={role === UserRole.TEACHER ? "PIN" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 p-4 rounded-xl flex items-center space-x-3 text-red-600">
                  <i className="fas fa-exclamation-triangle text-sm"></i>
                  <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 hover:bg-indigo-700"
              >
                Complete Login
              </button>

              {role === UserRole.TEACHER && (
                <div className="text-center pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep('register-staff')}
                    className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
                  >
                    New Staff? Register Here
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {step === 'register-staff' && (
          <div className="animate-in fade-in slide-in-from-right duration-500">
            <div className="mb-8">
              <button onClick={() => setStep('auth')} className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-indigo-600 mb-6">
                <i className="fas fa-arrow-left"></i>
              </button>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Staff Registration</h1>
              <p className="text-gray-400 text-sm mt-1">Submit your details for approval</p>
            </div>

            <form onSubmit={handleStaffRegistration} className="space-y-4">
              <input required placeholder="Full Name" className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-indigo-500" value={regName} onChange={e => setRegName(e.target.value)} />
              <input required type="email" placeholder="Official Email" className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-indigo-500" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
              <input required placeholder="Designation" className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-indigo-500" value={regDesignation} onChange={e => setRegDesignation(e.target.value)} />
              <input required placeholder="Contact Number" className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-indigo-500" value={regContact} onChange={e => setRegContact(e.target.value)} />
              <input required type="password" placeholder="Set your PIN" className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-indigo-500" value={regPin} onChange={e => setRegPin(e.target.value)} />
              
              {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
              {success && <p className="text-green-600 text-[10px] font-black uppercase text-center">{success}</p>}

              <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg">
                Submit Request
              </button>
            </form>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.3em]">SECURE CLOUD ACCESS</p>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
          animation-iteration-count: 2;
        }
      `}</style>
    </div>
  );
};

export default Login;
