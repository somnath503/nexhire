import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, ArrowRight, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    industry: 'Software Engineering'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to update user profile in PostgreSQL
    setTimeout(() => {
      setIsLoading(false);
      // Update local storage to reflect completed profile
      const user = JSON.parse(localStorage.getItem('nexhire_user') || '{}');
      user.profile_completed = true;
      user.company_name = formData.companyName;
      localStorage.setItem('nexhire_user', JSON.stringify(user));
      
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-bg-surface border border-gray-200 rounded-2xl p-10 shadow-xl animate-in fade-in slide-in-from-bottom-4">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} />
          </div>
          <h1 className="text-3xl font-serif text-text-main tracking-tight">Complete your profile</h1>
          <p className="text-text-muted mt-2">Let's get your workspace set up for hiring.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Your Full Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-bg-app border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Company Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Acme Corp"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full px-4 py-3 bg-bg-app border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-main uppercase tracking-wider">Primary Industry</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
              <select 
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-bg-app border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all appearance-none"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Hardware & IoT">Hardware & Embedded IoT</option>
                <option value="Finance">Finance & Fintech</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-brand-primary text-white text-sm font-medium rounded-xl hover:bg-brand-secondary transition-all">
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Save & Go to Dashboard <ArrowRight size={16} /></>}
          </button>
        </form>

      </div>
    </div>
  );
}