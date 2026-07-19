import { useState, useEffect } from 'react';
import { Mail, FileText, Loader2, RefreshCw, User as UserIcon } from 'lucide-react';
import { API_URL } from '../lib/api';

export default function CandidatesPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCandidates = async () => {
    setIsLoading(true);
    const userStr = localStorage.getItem('nexhire_user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user && user.role === 'RECRUITER') {
      try {
        const response = await fetch(`${API_URL}/api/applications/recruiter/${user.id}`);
        const data = await response.json();
        if (response.ok && Array.isArray(data)) setApplications(data);
      } catch (error) {
        console.error('Failed to fetch candidates', error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications(applications.map(app => 
          app.application_id === applicationId ? { ...app, status: newStatus } : app
        ));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-main">Candidate Roster</h1>
          <p className="text-text-muted mt-1">Review active applicants across your open requisitions.</p>
        </div>
        <button onClick={fetchCandidates} className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      <div className="bg-bg-surface border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Candidate Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Applied Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Tech Skills</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted"><Loader2 className="animate-spin mx-auto text-brand-primary mb-2" size={24} /> Fetching candidates...</td></tr>
              ) : applications.map((app) => (
                <tr key={app.application_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-main flex items-center gap-1.5"><UserIcon size={14}/> {app.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5"><Mail size={12}/> {app.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-text-main">{app.job_title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {app.skills ? app.skills.split(',').slice(0, 3).map((s: string, i: number) => (
                        <span key={i} className="text-[10px] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-text-muted truncate">{s.trim()}</span>
                      )) : <span className="text-xs text-text-muted">Not specified</span>}
                      {app.skills && app.skills.split(',').length > 3 && <span className="text-[10px] text-text-muted">+{app.skills.split(',').length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app.application_id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2.5 py-1.5 border appearance-none outline-hidden cursor-pointer shadow-xs ${
                        app.status === 'HIRED' ? 'bg-green-50 text-green-700 border-green-200' :
                        app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                        app.status === 'INTERVIEW' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="REVIEWING">REVIEWING</option>
                      <option value="INTERVIEW">INTERVIEWING</option>
                      <option value="HIRED">HIRED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{app.date}</td>
                  <td className="px-6 py-4 text-right">
                    {app.resume_url ? (
                      <a href={app.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-100 hover:text-brand-primary transition-colors">
                        <FileText size={16} /> View CV
                      </a>
                    ) : (
                      <span className="text-xs text-text-muted italic">No CV Attached</span>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && applications.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted">No candidates have applied to your active postings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}