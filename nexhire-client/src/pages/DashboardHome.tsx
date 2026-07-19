import { useEffect, useState } from 'react';
import { Users, Briefcase, Clock, FileText, CheckCircle2, XCircle, MapPin, Building2, RefreshCw, Loader2 } from 'lucide-react';
import CreateJobModal from '../components/CreateJobModal';
import { Link } from 'react-router-dom';
import { API_URL } from '../lib/api';

export default function DashboardHome() {
  const [role, setRole] = useState('RECRUITER');
  const [userId, setUserId] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  
  // States
  const [metrics, setMetrics] = useState({ openRoles: 0, activeCandidates: 0 });
  const [candidateApps, setCandidateApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('nexhire_user') || '{}');
    if (user.role) setRole(user.role);
    if (user.id) setUserId(user.id);
    
    if (user.role === 'RECRUITER' && user.id) {
      fetch(`${API_URL}/api/jobs`)
        .then(res => res.json())
        .then((jobs: any[]) => {
          if (Array.isArray(jobs)) {
            const myJobs = jobs.filter(j => j.recruiter_id === user.id);
            const published = myJobs.filter(j => j.status === 'PUBLISHED').length;
            const candidates = myJobs.reduce((sum, j) => sum + (j.applicants || 0), 0);
            setMetrics({ openRoles: published, activeCandidates: candidates });
          }
        })
        .catch(err => console.error("Failed to fetch metrics", err));
    } else if (user.role === 'CANDIDATE' && user.id) {
      fetchCandidateApps(user.id);
    }
  }, []);

  const fetchCandidateApps = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/applications/candidate/${id}/details`);
      const data = await res.json();
      if (Array.isArray(data)) setCandidateApps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'HIRED': return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold shadow-xs"><CheckCircle2 size={14}/> Hired</span>;
      case 'REJECTED': return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold shadow-xs"><XCircle size={14}/> Rejected</span>;
      case 'INTERVIEW': return <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-full text-xs font-semibold shadow-xs"><Users size={14}/> Interviewing</span>;
      default: return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold shadow-xs"><Clock size={14}/> Under Review</span>;
    }
  };

  // ==========================================
  // RECRUITER VIEW
  // ==========================================
  if (role === 'RECRUITER') {
    return (
      <>
        <div className="space-y-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-serif font-semibold text-text-main tracking-tight">Recruiter Overview</h1>
              <p className="text-text-muted mt-1 text-sm">Manage your active talent pipeline and open requisitions.</p>
            </div>
            <button onClick={() => setIsJobModalOpen(true)} className="px-6 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-xl hover:bg-brand-secondary transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2">
              + Create Job Post
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="p-4 rounded-xl bg-brand-primary/10 text-brand-primary"><Briefcase size={26} /></div>
              <div><p className="text-sm font-medium text-text-muted">Open Roles</p><p className="text-3xl font-bold text-text-main mt-1 tracking-tight">{metrics.openRoles}</p></div>
            </div>
            <div className="bg-bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="p-4 rounded-xl bg-brand-secondary/10 text-brand-secondary"><Users size={26} /></div>
              <div><p className="text-sm font-medium text-text-muted">Active Candidates</p><p className="text-3xl font-bold text-text-main mt-1 tracking-tight">{metrics.activeCandidates}</p></div>
            </div>
            <div className="bg-bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="p-4 rounded-xl bg-orange-50 text-orange-500"><Clock size={26} /></div>
              <div><p className="text-sm font-medium text-text-muted">Interviews</p><p className="text-3xl font-bold text-text-main mt-1 tracking-tight">0</p></div>
            </div>
          </div>
        </div>
        <CreateJobModal isOpen={isJobModalOpen} onClose={() => { setIsJobModalOpen(false); window.location.reload(); }} />
      </>
    );
  }

  // ==========================================
  // CANDIDATE VIEW
  // ==========================================
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-text-main tracking-tight">My Applications</h1>
          <p className="text-text-muted mt-1 text-sm">Track your job hunt progress and upcoming interviews.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => userId && fetchCandidateApps(userId)} className="p-2.5 bg-bg-surface border border-gray-200 text-text-muted rounded-xl hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <Link to="/jobs" className="px-6 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-xl hover:bg-brand-secondary transition-all shadow-sm cursor-pointer">
            Find More Jobs
          </Link>
        </div>
      </div>

      <div className="bg-bg-surface border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Role & Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Application Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-text-muted"><Loader2 className="animate-spin mx-auto text-brand-primary mb-2" size={24} /> Loading applications...</td></tr>
              ) : candidateApps.map((app) => (
                <tr key={app.application_id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-main text-base group-hover:text-brand-primary transition-colors">{app.job_title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building2 size={14} className="text-text-muted" />
                      <span className="text-sm font-medium text-text-muted">{app.company_name || 'NexHire Partner'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-text-muted"><MapPin size={14} /> {app.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-muted">
                    {app.date}
                  </td>
                </tr>
              ))}
              {!isLoading && candidateApps.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-text-muted">You haven't applied to any positions yet. Head over to the Jobs Board to get started!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}