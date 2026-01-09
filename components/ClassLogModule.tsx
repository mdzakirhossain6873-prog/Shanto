
import React, { useState, useEffect } from 'react';
import { ClassLog, ClassType } from '../types';
import { CLASSES, getSectionsForClass, STORAGE_KEYS } from '../constants';

interface ClassLogModuleProps {
  isTeacher: boolean;
  userClass: string;
  userSection: string;
}

const ClassLogModule: React.FC<ClassLogModuleProps> = ({ isTeacher, userClass, userSection }) => {
  const [logs, setLogs] = useState<ClassLog[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<ClassLog>>({
    class: '6th',
    section: 'K-shakha',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASS_LOGS) || '[]');
    setLogs(saved);
  }, []);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: ClassLog = {
      id: Date.now().toString(),
      date: formData.date || '',
      class: formData.class as ClassType,
      section: formData.section || '',
      subject: formData.subject || '',
      lessonSummary: formData.lessonSummary || '',
      homework: formData.homework || ''
    };

    const newList = [newLog, ...logs];
    setLogs(newList);
    localStorage.setItem(STORAGE_KEYS.CLASS_LOGS, JSON.stringify(newList));
    setIsAdding(false);
    setFormData({ class: '6th', section: 'K-shakha', date: new Date().toISOString().split('T')[0] });
  };

  const filteredLogs = isTeacher 
    ? logs 
    : logs.filter(l => l.class === userClass && l.section === userSection);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-book-open mr-3 text-indigo-600"></i> Class Logs
        </h2>
        {isTeacher && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`p-2 rounded-full transition-all ${isAdding ? 'bg-red-500 rotate-45' : 'bg-indigo-600'} text-white shadow-lg`}
          >
            <i className="fas fa-plus"></i>
          </button>
        )}
      </div>

      {isAdding && isTeacher && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-indigo-100 mb-8 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleAddLog} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl outline-indigo-500"
                value={formData.class}
                onChange={e => {
                  const cls = e.target.value as ClassType;
                  setFormData({...formData, class: cls, section: getSectionsForClass(cls)[0]});
                }}
              >
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl outline-indigo-500"
                value={formData.section}
                onChange={e => setFormData({...formData, section: e.target.value})}
              >
                {getSectionsForClass(formData.class as ClassType).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <input 
              required
              placeholder="Subject Name"
              className="w-full p-3 bg-gray-50 rounded-xl border-none outline-indigo-500"
              value={formData.subject || ''}
              onChange={e => setFormData({...formData, subject: e.target.value})}
            />
            <textarea 
              required
              placeholder="Today's Lesson Summary"
              rows={3}
              className="w-full p-3 bg-gray-50 rounded-xl border-none outline-indigo-500 resize-none"
              value={formData.lessonSummary || ''}
              onChange={e => setFormData({...formData, lessonSummary: e.target.value})}
            />
            <textarea 
              required
              placeholder="Homework Assignment"
              rows={2}
              className="w-full p-3 bg-gray-50 rounded-xl border-none outline-indigo-500 resize-none"
              value={formData.homework || ''}
              onChange={e => setFormData({...formData, homework: e.target.value})}
            />
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100">
              Post Update
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {filteredLogs.length > 0 ? filteredLogs.map(log => (
          <div key={log.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="bg-indigo-50 px-5 py-3 flex justify-between items-center border-b border-indigo-100/50">
              <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">{log.subject}</span>
              <span className="text-[10px] font-bold text-gray-400">{new Date(log.date).toLocaleDateString()}</span>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Lesson Summary</h4>
                <p className="text-gray-700 leading-relaxed text-sm">{log.lessonSummary}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Homework</h4>
                <p className="text-amber-800 font-medium text-sm">{log.homework}</p>
              </div>
              {isTeacher && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Target: Class {log.class} ({log.section})
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-20 text-gray-400">
             <i className="fas fa-tasks text-4xl mb-4 opacity-20"></i>
             <p>No class logs or homework posted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassLogModule;
