
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, Student, Teacher } from './types';
import { STORAGE_KEYS } from './constants';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import InitialSetup from './components/InitialSetup';
import Header from './components/Header';
import { initMockData } from './mockData';

const App: React.FC = () => {
  const [isSetupNeeded, setIsSetupNeeded] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Teacher | Student | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const teachers = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS) || '[]');
    const headmasterExists = teachers.some((t: Teacher) => t.isHeadmaster);
    
    if (!headmasterExists) {
      setIsSetupNeeded(true);
    }

    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      initMockData();
    }
  }, []);

  const handleLogin = (user: Teacher | Student) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  };

  const onSetupComplete = (headmaster: Teacher) => {
    setIsSetupNeeded(false);
    // Automatically log in the headmaster after setup
    handleLogin(headmaster);
  };

  if (isSetupNeeded) {
    return <InitialSetup onComplete={onSetupComplete} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#F7F9FF] flex flex-col w-full mx-auto font-sans">
        {currentUser && <Header user={currentUser} onLogout={handleLogout} />}
        
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <Routes>
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard/*" 
              element={
                currentUser ? (
                  'email' in currentUser ? (
                    <TeacherDashboard user={currentUser as Teacher} />
                  ) : (
                    <StudentDashboard user={currentUser as Student} />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
