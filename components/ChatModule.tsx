
import React, { useState, useEffect, useRef } from 'react';
import { Student, ChatMessage } from '../types';
import { STORAGE_KEYS } from '../constants';

interface ChatModuleProps {
  currentUser: Student;
}

const ChatModule: React.FC<ChatModuleProps> = ({ currentUser }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]'));
    setMessages(JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS) || '[]'));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedStudent]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedStudent) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedStudent.id,
      text: inputText,
      timestamp: Date.now()
    };

    const newList = [...messages, newMessage];
    setMessages(newList);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(newList));
    setInputText('');
  };

  const currentChat = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === selectedStudent?.id) ||
    (m.senderId === selectedStudent?.id && m.receiverId === currentUser.id)
  );

  // Peer Discovery Filter (by Class/Section)
  const classmates = students.filter(s => s.id !== currentUser.id && s.class === currentUser.class && s.section === currentUser.section);

  if (selectedStudent) {
    return (
      <div className="flex flex-col h-full bg-white relative">
        <div className="bg-white border-b border-gray-100 p-4 flex items-center sticky top-0 z-10 shadow-sm">
          <button onClick={() => setSelectedStudent(null)} className="mr-4 text-gray-400 p-1 hover:text-indigo-600 transition-colors">
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-3 overflow-hidden">
            {selectedStudent.photo ? (
              <img src={selectedStudent.photo} alt={selectedStudent.name} className="h-full w-full object-cover" />
            ) : (
              selectedStudent.name.charAt(0)
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">{selectedStudent.name}</h4>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Roll: {selectedStudent.rollNumber}</p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {currentChat.length > 0 ? currentChat.map(m => (
            <div key={m.id} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                m.senderId === currentUser.id 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none shadow-sm shadow-gray-100'
              }`}>
                {m.text}
                <div className={`text-[9px] mt-1 opacity-50 ${m.senderId === currentUser.id ? 'text-right' : 'text-left'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 text-gray-300 italic text-sm">
              <i className="fas fa-lock text-3xl mb-4 block opacity-10"></i>
              Start a safe conversation with {selectedStudent.name}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
          <input 
            className="flex-1 bg-gray-50 px-4 py-3 rounded-2xl text-sm border-none outline-indigo-500 placeholder:text-gray-400"
            placeholder="Type a message..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 text-white p-3 rounded-full shadow-lg shadow-indigo-100 transition-transform active:scale-90">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fas fa-comments mr-3 text-indigo-600"></i> Peer Chat
      </h2>
      
      <div className="bg-indigo-50 px-4 py-3 rounded-2xl mb-6 flex items-center text-xs text-indigo-700 border border-indigo-100 shadow-sm">
        <i className="fas fa-shield-alt mr-2"></i>
        <span>Privacy strictly enforced. Parent details hidden.</span>
      </div>

      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Classmates ({currentUser.class} • {currentUser.section})</h4>
      
      <div className="space-y-3">
        {classmates.length > 0 ? classmates.map(s => (
          <div 
            key={s.id} 
            onClick={() => setSelectedStudent(s)}
            className="bg-white p-4 rounded-2xl flex items-center border border-gray-100 shadow-sm cursor-pointer hover:bg-indigo-50/20 hover:border-indigo-100 active:scale-[0.98] transition-all"
          >
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-4 overflow-hidden border border-gray-50">
              {s.photo ? (
                <img src={s.photo} alt={s.name} className="h-full w-full object-cover" />
              ) : (
                s.name.charAt(0)
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{s.name}</h4>
              <p className="text-xs text-gray-500 font-mono tracking-tighter">Roll: {s.rollNumber}</p>
            </div>
            <div className="text-indigo-400 bg-indigo-50 p-2 rounded-xl">
              <i className="fas fa-comment-dots text-lg"></i>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 text-gray-400">
            <i className="fas fa-user-friends text-4xl mb-4 opacity-20"></i>
            <p>No other classmates found in your section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModule;
