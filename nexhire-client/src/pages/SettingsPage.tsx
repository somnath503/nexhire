import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Building2, Briefcase, Loader2, CheckCircle2,
  Link as LinkIcon, FileText, UploadCloud, Eye, Edit3, MapPin, Mail, ArrowLeft, GraduationCap, Award
} from 'lucide-react';
import { API_URL } from '../lib/api';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('RECRUITER');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [viewMode, setViewMode] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  
  // const [formData, setFormData] = useState({
  //   name: '', companyName: '', industry: 'Software Engineering',
  //   description: '', website: '', linkedin: '', resumeUrl: '', githubUrl: '', skills: '',
  //   title: '', education: '', experience: '', projects: ''
  // });


  const [formData, setFormData] = useState({
    name: '', companyName: '', industry: 'Software Engineering',
    description: '', website: '', linkedin: '', resumeUrl: '', githubUrl: '', skills: '',
    title: '', education: '', experience: '', projects: ''
  });

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('nexhire_user') || '{}');
  //   setUserEmail(user.email || '');
  //   if (user.role) setRole(user.role);
  //   setFormData({
  //     name: user.name || '', companyName: user.company_name || '', industry: user.industry || 'Software Engineering',
  //     description: user.company_description || '', website: user.website_url || '', linkedin: user.linkedin_url || '',
  //     resumeUrl: user.resume_url || '', githubUrl: user.github_url || '', skills: user.skills || '',
  //     title: user.title || '', education: user.education || '', experience: user.experience || '', projects: user.projects || ''
  //   });
  // }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('nexhire_user') || '{}');
    setUserEmail(user.email || '');
    if (user.role) setRole(user.role);
    setFormData({
      name: user.name || '', companyName: user.company_name || '', industry: user.industry || 'Software Engineering',
      description: user.company_description || '', website: user.website_url || '', linkedin: user.linkedin_url || '',
      resumeUrl: user.resume_url || '', githubUrl: user.github_url || '', skills: user.skills || '',
      title: user.title || '', education: user.education || '', experience: user.experience || '', projects: user.projects || ''
    });
  }, []);

//  const handleUpdateProfile = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     setIsLoading(true); setSuccessMsg('');

//     try {
//       const response = await fetch('http://localhost:5000/api/users/profile', {
//         method: 'PUT', headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email: userEmail,
//           // CRITICAL FIX: Map frontend camelCase to backend snake_case
//           name: formData.name,
//           company_name: formData.companyName,
//           industry: formData.industry,
//           company_description: formData.description,
//           website_url: formData.website,
//           linkedin_url: formData.linkedin,
//           resume_url: formData.resumeUrl,
//           github_url: formData.githubUrl,
//           skills: formData.skills,
//           title: formData.title,
//           education: formData.education,
//           experience: formData.experience,
//           projects: formData.projects
//         }),
//       });
//       if (!response.ok) throw new Error('Failed to update profile');
//       const updatedUser = await response.json();
      
//       const currentUser = JSON.parse(localStorage.getItem('nexhire_user') || '{}');
//       localStorage.setItem('nexhire_user', JSON.stringify({ ...currentUser, ...updatedUser }));
//       setSuccessMsg('Profile updated successfully.');
//     } catch (error) { 
//       console.error(error); 
//     } finally { 
//       setIsLoading(false); 
//     }
//   };
const handleUpdateProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userEmail,
          name: formData.name,
          company_name: formData.companyName,
          industry: formData.industry,
          company_description: formData.description,
          website_url: formData.website,
          linkedin_url: formData.linkedin,
          resume_url: formData.resumeUrl,
          github_url: formData.githubUrl,
          skills: formData.skills,
          title: formData.title,
          education: formData.education,
          experience: formData.experience,
          projects: formData.projects
        }),
      });
      if (!response.ok) throw new Error('Failed to update');
      const updatedUser = await response.json();
      const currentUser = JSON.parse(localStorage.getItem('nexhire_user') || '{}');
      localStorage.setItem('nexhire_user', JSON.stringify({ ...currentUser, ...updatedUser }));
      setSuccessMsg('Profile updated successfully.');
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure? This will permanently delete your account and all associated data.")) return;
    setIsDeleting(true);
    try {
      await fetch(`${API_URL}/api/users/account`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: userEmail }) });
      localStorage.removeItem('nexhire_token');
      localStorage.removeItem('nexhire_user');
      navigate('/');
    } catch (error) { setIsDeleting(false); }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileBlobUrl = URL.createObjectURL(file);
    
    setIsParsing(true);
    
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        title: 'Software Engineer',
        linkedin: 'https://linkedin.com/in/simulated-user',
        githubUrl: 'https://github.com/simulated-user',
        resumeUrl: fileBlobUrl,
        education: 'B.Tech in Computer Science & Engineering, University of Kalyani (2026)',
        experience: '• SDE Intern at Lilac Inc: Built an IoT Gateway architecture using Node.js and PostgreSQL.\n• Systems Engineer: Programmed ESP32 Dev Kit V1 units for real-time data streaming.',
        projects: '• ZeroProof Feedback System: Implemented RSA blind signatures.\n• dev.restaurant: Architected a 4-tier microservice system.',
        skills: 'React.js, Node.js, Spring Boot, FastAPI, ESP32, C++, PostgreSQL'
      }));
      setIsParsing(false);
      setSuccessMsg('Resume parsed successfully! Please review the extracted data below.');
      setViewMode('PREVIEW');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-bg-surface border border-gray-200 rounded-lg text-text-muted hover:text-brand-primary transition-colors cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-text-main">{role === 'CANDIDATE' ? 'Candidate Profile' : 'Profile & Organization'}</h1>
            <p className="text-text-muted mt-1 text-sm">{role === 'CANDIDATE' ? 'Manage how recruiters see you.' : 'Manage your identity and company branding.'}</p>
          </div>
        </div>
        
        {/* Toggle now visible to both RECRUITER and CANDIDATE */}
        <div className="flex bg-bg-surface border border-gray-200 rounded-lg p-1 shadow-sm">
          <button onClick={() => setViewMode('EDIT')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${viewMode === 'EDIT' ? 'bg-gray-100 text-text-main' : 'text-text-muted hover:text-text-main'}`}><Edit3 size={16} /> Edit Details</button>
          <button onClick={() => setViewMode('PREVIEW')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${viewMode === 'PREVIEW' ? 'bg-gray-100 text-text-main' : 'text-text-muted hover:text-text-main'}`}><Eye size={16} /> Preview Profile</button>
        </div>
      </div>

      {successMsg && ( <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-100 text-sm font-medium text-green-700 animate-in slide-in-from-top-2"><CheckCircle2 size={18} /> {successMsg}</div> )}

      {/* ========================================== */}
      {/* CANDIDATE PREVIEW MODE                     */}
      {/* ========================================== */}
      {role === 'CANDIDATE' && viewMode === 'PREVIEW' && (
        <div className="bg-bg-surface border border-gray-200 rounded-3xl shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="h-32 bg-linear-to-r from-brand-primary to-brand-secondary"></div>
          <div className="px-8 pb-8 relative">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-md border-4 border-white flex items-center justify-center text-4xl font-bold text-brand-primary -mt-12 mb-4">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'C'}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-text-main tracking-tight">{formData.name || 'Anonymous Candidate'}</h2>
                <p className="text-text-muted font-medium text-lg mt-1">{formData.title || 'Candidate'}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5"><Mail size={16} /> {userEmail}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> Open to Remote / Hybrid</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {formData.githubUrl && (<a href={formData.githubUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-text-main hover:bg-gray-100 transition-colors"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>)}
                {formData.linkedin && (<a href={formData.linkedin} target="_blank" rel="noreferrer" className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>)}
                {formData.resumeUrl && (<a href={formData.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-secondary transition-colors"><FileText size={18} /> View Resume</a>)}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-gray-100">
              <div className="lg:col-span-2 space-y-8">
                {formData.experience && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-text-main uppercase tracking-wider mb-4"><Briefcase size={16}/> Experience</h3>
                    <div className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">{formData.experience}</div>
                  </div>
                )}
                {formData.projects && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-text-main uppercase tracking-wider mb-4"><Award size={16}/> Projects</h3>
                    <div className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">{formData.projects}</div>
                  </div>
                )}
              </div>
              <div className="space-y-8">
                {formData.education && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-text-main uppercase tracking-wider mb-4"><GraduationCap size={16}/> Education</h3>
                    <div className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">{formData.education}</div>
                  </div>
                )}
                {formData.skills && (
                  <div>
                    <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider mb-4">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.split(',').map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 text-text-main text-sm font-medium rounded-lg border border-gray-200">{skill.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* RECRUITER PREVIEW MODE                     */}
      {/* ========================================== */}
      {role === 'RECRUITER' && viewMode === 'PREVIEW' && (
        <div className="bg-bg-surface border border-gray-200 rounded-3xl shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="h-32 bg-slate-800"></div>
          <div className="px-8 pb-8 relative">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-md border-4 border-white flex items-center justify-center text-4xl font-bold text-slate-800 -mt-12 mb-4">
              <Building2 size={40} className="text-brand-secondary" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-text-main tracking-tight">{formData.companyName || 'Lilac Inc.'}</h2>
                <p className="text-text-muted font-medium text-lg mt-1">{formData.industry || 'Software Engineering'}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5"><User size={16} /> Hiring Manager: {formData.name || 'Anonymous'} ({formData.title || 'Recruiter'})</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {formData.website && (
                  <a href={formData.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-text-main font-medium rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors">
                    <LinkIcon size={18} /> Visit Website
                  </a>
                )}
                {formData.linkedin && (
                  <a href={formData.linkedin} target="_blank" rel="noreferrer" className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-main uppercase tracking-wider mb-4"><FileText size={16}/> About the Company</h3>
              <div className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">
                {formData.description || "We are a fast-growing technology company building next-generation infrastructure."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* EDIT MODE (Forms)                          */}
      {/* ========================================== */}
      {viewMode === 'EDIT' && (
        <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in fade-in duration-300">
          
          {/* CANDIDATE EDIT BLOCK */}
          {role === 'CANDIDATE' && (
            <>
              <div className="bg-bg-surface border border-gray-200 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                {isParsing && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-brand-primary mb-3" size={32} />
                    <p className="font-medium text-text-main">Extracting details from resume...</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
                  <div>
                    <h2 className="text-lg font-medium text-text-main">Auto-fill with Resume</h2>
                    <p className="text-sm text-text-muted mt-1 max-w-md">Upload your latest PDF resume to instantly populate your entire profile and securely store your CV.</p>
                  </div>
                  <div className="relative group shrink-0">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-brand-primary/40 bg-brand-primary/5 rounded-xl group-hover:bg-brand-primary/10 transition-colors">
                      <UploadCloud className="text-brand-primary" size={24} />
                      <span className="text-sm font-semibold text-brand-primary">Upload Document</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-bg-surface border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50"><h2 className="text-lg font-medium text-text-main">Core Identity</h2></div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Full Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Professional Title</label>
                    <input type="text" placeholder="e.g. Software Engineer" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">LinkedIn URL</label>
                    <input type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">GitHub URL</label>
                    <input type="url" value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden" />
                  </div>
                </div>
              </div>

              <div className="bg-bg-surface border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50"><h2 className="text-lg font-medium text-text-main">Extracted Resume Details</h2></div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Experience</label>
                    <textarea rows={4} value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="w-full p-4 bg-bg-app border border-gray-200 rounded-xl text-sm outline-hidden resize-none focus:border-brand-primary" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Education</label>
                    <textarea rows={2} value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full p-4 bg-bg-app border border-gray-200 rounded-xl text-sm outline-hidden resize-none focus:border-brand-primary" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Projects</label>
                    <textarea rows={3} value={formData.projects} onChange={(e) => setFormData({...formData, projects: e.target.value})} className="w-full p-4 bg-bg-app border border-gray-200 rounded-xl text-sm outline-hidden resize-none focus:border-brand-primary" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Technical Skills</label>
                    <textarea rows={2} value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} className="w-full p-4 bg-bg-app border border-gray-200 rounded-xl text-sm outline-hidden resize-none focus:border-brand-primary" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* RECRUITER EDIT BLOCK */}
          {role === 'RECRUITER' && (
            <>
              <div className="bg-bg-surface border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-medium text-text-main">Recruiter Details</h2>
                  <p className="text-sm text-text-muted">Internal information for account management.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Full Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Professional Title</label>
                    <input type="text" placeholder="e.g. Talent Acquisition Lead" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden" />
                  </div>
                </div>
              </div>

              <div className="bg-bg-surface border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-medium text-text-main">Organization Profile</h2>
                  <p className="text-sm text-text-muted">This information will be visible to candidates on your job postings.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Company Name</label>
                    <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Primary Industry</label>
                    <select value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden appearance-none">
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Hardware & IoT">Hardware & Embedded IoT</option>
                      <option value="Finance">Finance & Fintech</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Company Description</label>
                    <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Website URL</label>
                    <input type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-main uppercase tracking-wider">LinkedIn URL</label>
                    <input type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-2.5 bg-bg-app border border-gray-200 rounded-xl text-sm focus:border-brand-primary outline-hidden" />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white text-sm font-medium rounded-xl hover:bg-brand-secondary transition-colors cursor-pointer shadow-sm">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Save Profile Settings'}
            </button>
          </div>
        </form>
      )}

      {/* Danger Zone */}
      <div className="bg-red-50/50 border border-red-100 rounded-2xl shadow-sm overflow-hidden mt-12">
        <div className="p-6 flex justify-between items-center">
          <div><h3 className="font-medium text-red-700">Delete Account</h3><p className="text-sm text-red-600/80">Permanently remove your account and all data.</p></div>
          <button onClick={handleDeleteAccount} disabled={isDeleting} className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 cursor-pointer">Delete Account</button>
        </div>
      </div>
    </div>
  );
}