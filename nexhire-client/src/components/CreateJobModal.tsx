// import { useState } from 'react';
// import { X, Loader2, Save } from 'lucide-react';

// interface CreateJobModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// export default function CreateJobModal({ isOpen, onClose, onSuccess }: CreateJobModalProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [jobData, setJobData] = useState({ title: '', stack: '', location: '', type: 'Full-time' });

//   if (!isOpen) return null;

//   const submitJob = async (status: 'PUBLISHED' | 'DRAFT') => {
//     // Basic validation
//     if (!jobData.title.trim() || !jobData.location.trim()) {
//       setErrorMsg("Title and Location are required.");
//       return;
//     }

//     setIsLoading(true);
//     setErrorMsg('');

//     try {
//       const userStr = localStorage.getItem('nexhire_user');
//       const user = userStr ? JSON.parse(userStr) : null;
      
//       if (!user || !user.id) throw new Error("Authentication error. Please log in again.");

//       const response = await fetch('http://localhost:5000/api/jobs', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           recruiter_id: user.id,
//           ...jobData,
//           status: status
//         }),
//       });

//       if (!response.ok) throw new Error('Failed to create job');
      
//       setJobData({ title: '', stack: '', location: '', type: 'Full-time' });
//       if (onSuccess) onSuccess();
//       onClose();
//     } catch (err: any) {
//       setErrorMsg(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-main/20 backdrop-blur-sm p-4">
//       <div className="bg-bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h3 className="text-lg font-semibold text-text-main">Create New Job</h3>
//           <button onClick={onClose} className="p-1 text-text-muted hover:bg-gray-100 rounded-md transition-colors cursor-pointer"><X size={20} /></button>
//         </div>

//         <div className="p-6 space-y-4">
//           {errorMsg && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-100">{errorMsg}</div>}

//           <div className="space-y-1.5">
//             <label className="text-sm font-medium text-text-main">Job Title *</label>
//             <input required type="text" placeholder="e.g. Frontend Engineer" value={jobData.title} onChange={(e) => setJobData({...jobData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-hidden" />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-sm font-medium text-text-main">Tech Stack / Skills</label>
//             <input type="text" placeholder="e.g. React, Node.js" value={jobData.stack} onChange={(e) => setJobData({...jobData, stack: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-hidden" />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-sm font-medium text-text-main">Location *</label>
//             <input required type="text" placeholder="e.g. Remote, Bangalore" value={jobData.location} onChange={(e) => setJobData({...jobData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-hidden" />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-sm font-medium text-text-main">Employment Type</label>
//             <select value={jobData.type} onChange={(e) => setJobData({...jobData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-hidden bg-white">
//               <option value="Full-time">Full-time</option>
//               <option value="Contract">Contract</option>
//               <option value="Internship">Internship</option>
//             </select>
//           </div>

//           <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
//             <button 
//               type="button" 
//               onClick={() => submitJob('DRAFT')} 
//               disabled={isLoading}
//               className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-main bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
//             >
//               <Save size={16} /> Save Draft
//             </button>
//             <button 
//               type="button" 
//               onClick={() => submitJob('PUBLISHED')}
//               disabled={isLoading} 
//               className="px-4 py-2 text-sm font-medium bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors w-24 flex justify-center cursor-pointer"
//             >
//               {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Publish'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { API_URL } from '../lib/api';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateJobModal({ isOpen, onClose, onSuccess }: CreateJobModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [jobData, setJobData] = useState({ title: '', stack: '', location: '', type: 'Full-time', description: '' });

  if (!isOpen) return null;

  const submitJob = async (status: 'PUBLISHED' | 'DRAFT') => {
    if (!jobData.title.trim() || !jobData.location.trim()) {
      setErrorMsg("Title and Location are required.");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const userStr = localStorage.getItem('nexhire_user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user || !user.id) throw new Error("Authentication error. Please log in again.");

      const response = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiter_id: user.id,
          ...jobData,
          status: status
        }),
      });

      if (!response.ok) throw new Error('Failed to create job');
      
      setJobData({ title: '', stack: '', location: '', type: 'Full-time', description: '' });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-main/20 backdrop-blur-sm p-4">
      <div className="bg-bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-text-main">Create New Job</h3>
          <button onClick={onClose} className="p-1 text-text-muted hover:bg-gray-100 rounded-md transition-colors cursor-pointer"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-100">{errorMsg}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium text-text-main">Job Title *</label>
              <input required type="text" placeholder="e.g. Frontend Engineer" value={jobData.title} onChange={(e) => setJobData({...jobData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-hidden" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium text-text-main">Role Details / Job Description</label>
              <textarea rows={4} placeholder="Describe the responsibilities, requirements, and perks..." value={jobData.description} onChange={(e) => setJobData({...jobData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-hidden resize-none" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium text-text-main">Tech Stack / Skills</label>
              <input type="text" placeholder="e.g. React, Node.js, PostgreSQL" value={jobData.stack} onChange={(e) => setJobData({...jobData, stack: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-hidden" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-main">Location *</label>
              <input required type="text" placeholder="e.g. Remote, Bangalore" value={jobData.location} onChange={(e) => setJobData({...jobData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-hidden" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-main">Employment Type</label>
              <select value={jobData.type} onChange={(e) => setJobData({...jobData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-hidden bg-white">
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
            <button type="button" onClick={() => submitJob('DRAFT')} disabled={isLoading} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-main bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <Save size={16} /> Save Draft
            </button>
            <button type="button" onClick={() => submitJob('PUBLISHED')} disabled={isLoading} className="px-4 py-2 text-sm font-medium bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors w-24 flex justify-center cursor-pointer">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}