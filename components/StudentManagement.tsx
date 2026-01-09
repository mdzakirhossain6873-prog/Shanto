
import React, { useState, useEffect, useRef } from 'react';
import { Student, ClassType } from '../types';
import { CLASSES, getSectionsForClass, STORAGE_KEYS } from '../constants';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<Student>>({
    class: '6th',
    section: 'K-shakha',
    photo: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    setStudents(saved);
  }, []);

  const saveStudents = (newList: Student[]) => {
    setStudents(newList);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(newList));
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingStudentId(null);
    setFormData({ class: '6th', section: 'K-shakha', photo: '' });
    setError('');
  };

  const handleOpenAdd = () => {
    setEditingStudentId(null);
    setFormData({ class: '6th', section: 'K-shakha', photo: '' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudentId(student.id);
    setFormData({ ...student });
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError('Photo too large (>1MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (students.some(s => s.rollNumber === formData.rollNumber && s.id !== editingStudentId)) {
      setError('Duplicate Roll Number');
      return;
    }

    if (editingStudentId) {
      const updatedList = students.map(s => s.id === editingStudentId ? { ...s, ...formData } as Student : s);
      saveStudents(updatedList);
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: formData.name || '',
        rollNumber: formData.rollNumber || '',
        fatherName: formData.fatherName || '',
        parentMobile: formData.parentMobile || '',
        class: formData.class as ClassType,
        section: formData.section || '',
        password: 'pass',
        photo: formData.photo
      };
      saveStudents([...students, newStudent]);
    }
    resetForm();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this record?')) {
      saveStudents(students.filter(s => s.id !== id));
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNumber.includes(searchQuery)
  );

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Directory</h2>
          <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">Total: {students.length} Records</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="hidden md:flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all font-bold text-sm"
        >
          <i className="fas fa-plus"></i>
          <span>Enroll New Student</span>
        </button>
      </div>

      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400">
          <i className="fas fa-search"></i>
        </div>
        <input 
          type="text"
          placeholder="Filter by name or roll number..."
          className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[32px] shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all text-base font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full py-32 text-center text-gray-300">
            <i className="fas fa-user-slash text-6xl mb-6 opacity-10"></i>
            <p className="text-lg font-bold">No students matched your search</p>
          </div>
        ) : (
          filteredStudents.map(s => (
            <div 
              key={s.id} 
              onClick={() => handleOpenEdit(s)}
              className="bg-white p-6 rounded-[36px] border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-24 w-24 rounded-[32px] bg-indigo-50 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                  {s.photo ? (
                    <img src={s.photo} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-indigo-400 uppercase">{s.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg leading-tight">{s.name}</h4>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Class {s.class} ({s.section})</p>
                </div>
                <div className="w-full pt-4 border-t border-gray-50 flex justify-around items-center">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Roll #</p>
                    <p className="font-bold text-gray-700 text-sm">{s.rollNumber}</p>
                  </div>
                  <div className="h-6 w-px bg-gray-100"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Mobile</p>
                    <p className="font-bold text-gray-700 text-sm">{s.parentMobile.slice(-4).padStart(s.parentMobile.length, '*')}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={handleOpenAdd}
        className="md:hidden fixed bottom-24 right-6 h-16 w-16 bg-indigo-600 text-white rounded-[24px] shadow-2xl flex items-center justify-center text-2xl z-40 animate-bounce-slow"
      >
        <i className="fas fa-plus"></i>
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-[48px] p-8 md:p-12 shadow-3xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                {editingStudentId ? 'Update Record' : 'Add Student'}
              </h3>
              <button onClick={resetForm} className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="h-32 w-32 rounded-[40px] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-all group relative"
                >
                  {formData.photo ? (
                    <img src={formData.photo} className="h-full w-full object-cover" />
                  ) : (
                    <i className="fas fa-camera text-3xl text-indigo-300"></i>
                  )}
                  <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-sync text-white text-xl"></i>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-[0.2em]">Profile Picture</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                  <input required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-bold" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Roll Number</label>
                  <input required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-bold" value={formData.rollNumber || ''} onChange={e => setFormData({...formData, rollNumber: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Mobile</label>
                  <input required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-bold" value={formData.parentMobile || ''} onChange={e => setFormData({...formData, parentMobile: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Class</label>
                  <select className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value as ClassType})}>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Section</label>
                  <select className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})}>
                    {getSectionsForClass(formData.class as ClassType).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-black text-center uppercase tracking-widest">{error}</p>}

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                {editingStudentId && (
                  <button type="button" onClick={(e) => handleDelete(e, editingStudentId)} className="order-3 sm:order-1 px-8 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors">Delete</button>
                )}
                <button type="submit" className="flex-1 order-1 sm:order-2 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  {editingStudentId ? 'Save Changes' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
