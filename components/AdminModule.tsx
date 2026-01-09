
import React, { useState, useEffect } from 'react';
import { Teacher, Staff, TimeTableEntry, UserRole, ClassType } from '../types';
import { STORAGE_KEYS, CLASSES, DAYS_OF_WEEK } from '../constants';
import { DatabaseService } from '../services/db';

const AdminModule: React.FC = () => {
  const [subTab, setSubTab] = useState<'profile' | 'staff' | 'teachers' | 'timetable'>('profile');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [timetable, setTimetable] = useState<TimeTableEntry[]>([]);
  const [schoolInfo, setSchoolInfo] = useState<{ name: string; accessCode: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [s, t, tt, info] = await Promise.all([
      DatabaseService.getStaff(),
      DatabaseService.getTeachers(),
      DatabaseService.getTimetable(),
      DatabaseService.getSchoolInfo()
    ]);
    setStaff(s);
    setTeachers(t);
    setTimetable(tt);
    setSchoolInfo(info);
  };

  const handleApproveTeacher = async (id: string) => {
    const updated = teachers.map(t => t.id === id ? { ...t, status: 'APPROVED' as const } : t);
    await DatabaseService.saveTeachers(updated);
    setTeachers(updated);
  };

  const handleRejectTeacher = async (id: string) => {
    if (window.confirm('Are you sure you want to reject and delete this registration?')) {
      const updated = teachers.filter(t => t.id !== id);
      await DatabaseService.saveTeachers(updated);
      setTeachers(updated);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const newStaff: Staff = {
      id: editingItem?.id || Date.now().toString(),
      name: data.get('name') as string,
      designation: data.get('designation') as string,
      contact: data.get('contact') as string,
    };
    
    const newList = editingItem 
      ? staff.map(s => s.id === editingItem.id ? newStaff : s)
      : [...staff, newStaff];
    
    await DatabaseService.saveStaff(newList);
    setStaff(newList);
    setIsModalOpen(false);
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const newTeacher: Teacher = {
      id: editingItem?.id || Date.now().toString(),
      name: data.get('name') as string,
      email: data.get('email') as string,
      role: UserRole.TEACHER,
      designation: data.get('designation') as string,
      contact: data.get('contact') as string,
      pin: data.get('pin') as string,
      isHeadmaster: editingItem?.isHeadmaster || false,
      status: 'APPROVED'
    };
    
    const newList = editingItem 
      ? teachers.map(t => t.id === editingItem.id ? newTeacher : t)
      : [...teachers, newTeacher];
    
    await DatabaseService.saveTeachers(newList);
    setTeachers(newList);
    setIsModalOpen(false);
  };

  const pendingTeachers = teachers.filter(t => t.status === 'PENDING');
  const approvedTeachers = teachers.filter(t => t.status === 'APPROVED');

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Management Console</h2>
          <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">Headmaster Access Level</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          {['profile', 'staff', 'teachers', 'timetable'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
                subTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {subTab === 'profile' && schoolInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 rounded-[40px] text-white shadow-2xl">
            <h3 className="text-3xl font-black mb-8 leading-tight">{schoolInfo.name}</h3>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">School PIN</p>
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-mono font-black tracking-[0.2em]">{schoolInfo.accessCode}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <i className="fas fa-users-cog text-indigo-500 text-2xl mb-4"></i>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Team Size</p>
              <p className="text-3xl font-black text-gray-900">{teachers.length + staff.length}</p>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <i className="fas fa-bell text-amber-500 text-2xl mb-4"></i>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requests</p>
              <p className="text-3xl font-black text-gray-900">{pendingTeachers.length}</p>
            </div>
          </div>
        </div>
      )}

      {subTab === 'teachers' && pendingTeachers.length > 0 && (
        <section className="bg-amber-50/50 p-6 rounded-[40px] border border-amber-100">
          <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.3em] mb-6 flex items-center px-2">
            <i className="fas fa-user-clock mr-3"></i> Approval Queue
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTeachers.map(t => (
              <div key={t.id} className="bg-white p-6 rounded-3xl shadow-sm border border-amber-200">
                <h4 className="font-black text-gray-900 text-lg mb-1">{t.name}</h4>
                <p className="text-indigo-600 text-[10px] font-black uppercase mb-4 tracking-widest">{t.designation}</p>
                <div className="flex space-x-2">
                  <button onClick={() => handleApproveTeacher(t.id)} className="flex-1 bg-green-500 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest">Approve</button>
                  <button onClick={() => handleRejectTeacher(t.id)} className="flex-1 bg-red-50 text-red-500 font-black py-3 rounded-xl text-[10px] uppercase tracking-widest">Deny</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rest of the UI remains consistent but uses DatabaseService */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subTab === 'staff' && staff.map(s => (
          <div key={s.id} onClick={() => { setEditingItem(s); setIsModalOpen(true); }} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer">
            <h4 className="font-black text-gray-900 text-lg mb-1">{s.name}</h4>
            <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">{s.designation}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-[48px] p-8 shadow-3xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Record Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center">
                <i className="fas fa-times"></i>
              </button>
            </div>
            {/* Forms remain similar but with handle...Submit calling DatabaseService */}
            {subTab === 'staff' && (
              <form onSubmit={handleStaffSubmit} className="space-y-6">
                <input name="name" required placeholder="Full Name" defaultValue={editingItem?.name} className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold" />
                <input name="designation" required placeholder="Designation" defaultValue={editingItem?.designation} className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold" />
                <input name="contact" required placeholder="Contact" defaultValue={editingItem?.contact} className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold" />
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl">Save Changes</button>
              </form>
            )}
            {/* Add more forms for teachers/timetable here if needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModule;
