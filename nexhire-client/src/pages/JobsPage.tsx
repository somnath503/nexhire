import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MapPin, Loader2, RefreshCw, Building2, ExternalLink, Link as LinkIcon, CheckCircle2, Briefcase } from 'lucide-react';
import CreateJobModal from '../components/CreateJobModal';
import { API_URL } from '../lib/api';

interface Job {
  id: string;
  recruiter_id: number;
  title: string;
  stack: string;
  location: string;
  type: string;
  status: string;
  applicants: number;
  date: string;
  company_name?: string;
  company_description?: string;
  website_url?: string;
  linkedin_url?: string;
}

export default function JobsPage() {
  const [role, setRole] = useState('RECRUITER');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('nexhire_user') || '{}');
    if (user.role) setRole(user.role);
    
    fetchJobs();

    const loadAppliedJobs = async () => {
      if (user && user.role === 'CANDIDATE' && user.id) {
        try {
          const response = await fetch(`${API_URL}/api/applications/candidate/${user.id}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          if (Array.isArray(data)) {
            setAppliedJobs(new Set(data.map((id: any) => id.toString())));
          }
        } catch (err) {
          console.error("Failed to load applied jobs", err);
        }
      }
    };
    loadAppliedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/jobs`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setJobs(data);
      } else setJobs([]);
    } catch (error) {
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    if (newStatus === 'DELETE') {
      if (!window.confirm("Are you sure you want to delete this job?")) return;
      try {
        await fetch(`${API_URL}/api/jobs/${jobId}`, { method: 'DELETE' });
        setJobs(jobs.filter(j => j.id !== jobId)); 
      } catch (err) { console.error('Failed to delete job', err); }
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) { console.error('Failed to update status', err); }
  };

  const handleApply = async (jobId: string) => {
    if (appliedJobs.has(jobId)) return;
    
    const userStr = localStorage.getItem('nexhire_user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user || !user.id) {
      alert("Error: Missing user ID. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/jobs/${jobId}/apply`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: user.id })
      });
      
      if (res.ok) {
        setAppliedJobs(new Set(appliedJobs).add(jobId));
        fetchJobs(); 
      }
    } catch (error) {
      console.error('Failed to apply', error);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const safeTitle = job.title ? job.title.toLowerCase() : '';
    const safeStack = job.stack ? job.stack.toLowerCase() : '';
    const safeCompany = job.company_name ? job.company_name.toLowerCase() : '';
    
    const matchesSearch = safeTitle.includes(searchQuery.toLowerCase()) || safeStack.includes(searchQuery.toLowerCase()) || safeCompany.includes(searchQuery.toLowerCase());
    
    if (role === 'CANDIDATE') return matchesSearch && job.status === 'PUBLISHED';
    const user = JSON.parse(localStorage.getItem('nexhire_user') || '{}');
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    if (role === 'RECRUITER') return matchesSearch && matchesStatus && job.recruiter_id === user.id;
    return matchesSearch && matchesStatus;
  });

  // =====================================
  // CANDIDATE VIEW: Job Board
  // =====================================
  if (role === 'CANDIDATE') {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-text-main">Find Jobs</h1>
          <p className="text-text-muted mt-1">Discover your next opportunity and review organization details.</p>
        </div>

        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-3.5 text-text-muted" size={20} />
          <input
            type="text" placeholder="Search roles, skills, or companies..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-bg-surface border border-gray-200 rounded-2xl text-sm font-medium focus:outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm"
          />
        </div>

        {isLoading ? (
           <div className="py-12 text-center text-text-muted"><Loader2 className="animate-spin mx-auto text-brand-primary mb-2" size={24} /> Loading jobs...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {filteredJobs.map((job) => {
              const hasApplied = appliedJobs.has(job.id.toString());
              return (
                <div key={job.id} className="bg-bg-surface border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50/30">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-text-main group-hover:text-brand-primary transition-colors">{job.title}</h3>
                      <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wide rounded-full shrink-0">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
                      <span className="flex items-center gap-1.5"><Building2 size={16} className="text-brand-secondary" /> {job.company_name || 'NexHire Partner'}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={16} className="text-brand-secondary" /> {job.location}</span>
                    </div>
                  </div>

                  {/* Card Body - Details & Links */}
                  <div className="p-6 grow flex flex-col gap-5">
                    
                    {/* Organization Links */}
                    {(job.website_url || job.linkedin_url) && (
                      <div className="flex flex-wrap items-center gap-3">
                        {job.website_url && (
                          <a href={job.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-text-main hover:text-white bg-gray-100 hover:bg-brand-primary px-4 py-2 rounded-xl transition-colors cursor-pointer">
                            <LinkIcon size={16} /> Company Website
                          </a>
                        )}
                        {job.linkedin_url && (
                          <a href={job.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-4 py-2 rounded-xl transition-colors cursor-pointer">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                    )}

                    {/* Role & Company Details */}
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold text-text-main uppercase tracking-wider mb-2">
                        <Briefcase size={14} /> Role Details & Organization
                      </h4>
                      <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
                        {job.company_description || "An exciting opportunity to join a fast-paced environment and build modern software solutions."}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2">Technical Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.stack ? job.stack.split(',').map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-brand-secondary/5 border border-brand-secondary/10 text-brand-secondary text-xs font-bold rounded-lg">{skill.trim()}</span>
                        )) : <span className="text-xs text-text-muted italic">No specific stack listed</span>}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer (Action) */}
                  <div className="p-6 pt-0 mt-auto">
                    <button 
                      onClick={() => handleApply(job.id.toString())} 
                      disabled={hasApplied}
                      className={`w-full py-3.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                        hasApplied 
                        ? 'bg-green-50 text-green-700 border border-green-200 shadow-inner cursor-default' 
                        : 'bg-brand-primary text-white hover:bg-brand-secondary cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5'
                      }`}
                    >
                      {hasApplied ? <><CheckCircle2 size={18} /> Application Submitted</> : <>Submit Application <ExternalLink size={16} /></>}
                    </button>
                  </div>

                </div>
              );
            })}
            {filteredJobs.length === 0 && <div className="col-span-2 py-12 text-center text-text-muted">No open positions found matching your search.</div>}
          </div>
        )}
      </div>
    );
  }

  // =====================================
  // RECRUITER VIEW: Management Table 
  // =====================================
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-main">Jobs Directory</h1>
          <p className="text-text-muted mt-1">Manage and track all open requisitions.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-secondary transition-all shadow-md cursor-pointer">
          <Plus size={18} /> New Job Post
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 text-text-muted" size={18} />
          <input type="text" placeholder="Search by title or tech stack..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-bg-surface border border-gray-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm" />
        </div>
        <div className="relative flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3.5 top-3 text-text-muted pointer-events-none" size={18} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-2.5 bg-bg-surface border border-gray-200 rounded-xl text-sm font-medium text-text-main hover:bg-gray-50 transition-colors shadow-sm cursor-pointer appearance-none outline-hidden focus:border-brand-primary">
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <button onClick={fetchJobs} className="p-2.5 bg-bg-surface border border-gray-200 rounded-xl hover:bg-gray-50 text-text-muted transition-colors shadow-sm cursor-pointer" title="Refresh Data"><RefreshCw size={18} /></button>
        </div>
      </div>

      <div className="bg-bg-surface border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Role & Tech Stack</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Candidates</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date Created</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted"><Loader2 className="animate-spin mx-auto text-brand-primary mb-2" size={24} /> Loading jobs...</td></tr>
              ) : filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-main">{job.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{job.stack || 'No stack specified'} • {job.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-text-muted"><MapPin size={14} /> {job.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${ job.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' : job.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-700 border-gray-200' }`}>{job.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2"><span className="text-sm font-medium text-text-main">{job.applicants}</span></div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{job.date}</td>
                  <td className="px-6 py-4 text-right">
                    <select value="" onChange={(e) => handleStatusChange(job.id, e.target.value)} className="text-xs font-medium bg-gray-50 border border-gray-200 text-text-main rounded-md px-2 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors outline-hidden focus:border-brand-primary">
                      <option value="" disabled>Edit Status...</option>
                      <option value="PUBLISHED">Set: Published</option>
                      <option value="DRAFT">Set: Draft</option>
                      <option value="CLOSED">Set: Closed</option>
                      <option value="DELETE" className="text-red-600 font-bold">Delete Job</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredJobs.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted">No jobs found. Create one to get started!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchJobs} />
    </div>
  );
}