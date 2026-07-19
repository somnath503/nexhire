import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, Lock, User as UserIcon, Loader2, UserCircle, Briefcase, KeyRound, GraduationCap } from 'lucide-react';
import { API_URL } from '../lib/api';

type AuthMode = 'LOGIN' | 'SIGNUP_INIT' | 'SIGNUP_VERIFY' | 'FORGOT_INIT' | 'FORGOT_VERIFY';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<'RECRUITER' | 'CANDIDATE'>('RECRUITER');
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMsg] = useState('');

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); setSuccessMsg(''); setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/request-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email }),
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      setMode(mode === 'SIGNUP_INIT' ? 'SIGNUP_VERIFY' : 'FORGOT_VERIFY');
      setSuccessMsg('Verification code sent! Check your mail.');
    } catch (err: any) { setErrorMessage(err.message); } finally { setIsLoading(false); }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); setIsLoading(true);
    let endpoint = '/api/auth/login';
    if (mode === 'SIGNUP_VERIFY') endpoint = '/api/auth/signup';
    if (mode === 'FORGOT_VERIFY') endpoint = '/api/auth/reset-password';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');

      if (mode === 'FORGOT_VERIFY') {
        setSuccessMsg('Password reset successful. You can now log in.');
        setMode('LOGIN');
        return;
      }

      localStorage.setItem('nexhire_token', data.token);
      localStorage.setItem('nexhire_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err: any) { setErrorMessage(err.message); } finally { setIsLoading(false); }
  };

  const triggerDemoLogin = () => {
    setIsLoading(true); setErrorMessage('');
    setTimeout(() => {
      localStorage.setItem('nexhire_token', 'demo_mode_active');
      localStorage.setItem('nexhire_user', JSON.stringify({ id: 1, email: 'demo@nexhire.com', role: selectedRole }));
      navigate('/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-between selection:bg-brand-primary/20">
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <button onClick={() => {
          if (mode === 'SIGNUP_VERIFY') setMode('SIGNUP_INIT');
          else if (mode === 'FORGOT_VERIFY') setMode('FORGOT_INIT');
          else if (mode !== 'LOGIN') setMode('LOGIN');
          else navigate(-1);
        }} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-brand-primary cursor-pointer p-2 -ml-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={18} /> Back
        </button>
        <Link to="/" className="text-2xl font-bold text-brand-primary tracking-tight hover:opacity-90">NexHire</Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-bg-surface border border-gray-200/70 rounded-3xl p-8 shadow-xl">
          
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-serif text-text-main tracking-tight">
              {mode === 'LOGIN' ? 'Welcome Back' : mode.includes('SIGNUP') ? 'Create Account' : 'Reset Password'}
            </h2>
            <p className="text-sm text-text-muted">
              {mode.includes('VERIFY') ? 'Enter the OTP and your secure password.' : 'Select your identity to continue.'}
            </p>
          </div>

          {(mode === 'LOGIN' || mode === 'SIGNUP_INIT') && (
            <div className="flex p-1 mb-8 bg-gray-100 rounded-xl">
              <button type="button" onClick={() => setSelectedRole('RECRUITER')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${selectedRole === 'RECRUITER' ? 'bg-white shadow-sm text-brand-primary' : 'text-text-muted hover:text-text-main'}`}>
                <Briefcase size={16} /> Recruiter
              </button>
              <button type="button" onClick={() => setSelectedRole('CANDIDATE')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${selectedRole === 'CANDIDATE' ? 'bg-white shadow-sm text-brand-primary' : 'text-text-muted hover:text-text-main'}`}>
                <UserCircle size={16} /> Candidate
              </button>
            </div>
          )}

          <form onSubmit={(mode === 'SIGNUP_INIT' || mode === 'FORGOT_INIT') ? requestOTP : handleFinalSubmit} className="space-y-4">
            {errorMessage && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-medium">{errorMessage}</div>}
            {successMessage && <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 font-medium">{successMessage}</div>}

            {(mode === 'LOGIN' || mode === 'SIGNUP_INIT' || mode === 'FORGOT_INIT') && (
              <>
                {mode === 'SIGNUP_INIT' && (
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                    <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={isLoading} className="w-full pl-11 pr-4 py-3 bg-bg-app border border-gray-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-brand-primary transition-all" />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                  <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={isLoading} className="w-full pl-11 pr-4 py-3 bg-bg-app border border-gray-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-brand-primary transition-all" />
                </div>
              </>
            )}

            {(mode === 'LOGIN' || mode === 'SIGNUP_VERIFY' || mode === 'FORGOT_VERIFY') && (
              <>
                {mode.includes('VERIFY') && (
                  <div className="relative animate-in fade-in slide-in-from-right-4">
                    <KeyRound className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                    <input required type="text" maxLength={6} placeholder="6-Digit OTP Code" value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value})} disabled={isLoading} className="w-full pl-11 pr-4 py-3 bg-bg-app border border-gray-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-brand-primary transition-all" />
                  </div>
                )}
                <div className="relative animate-in fade-in slide-in-from-right-4">
                  <Lock className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                  <input required type="password" placeholder={mode === 'FORGOT_VERIFY' ? "Set New Password" : "Password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} disabled={isLoading} className="w-full pl-11 pr-4 py-3 bg-bg-app border border-gray-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-brand-primary transition-all" />
                </div>
                {mode === 'LOGIN' && (
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setMode('FORGOT_INIT')} className="text-xs font-semibold text-brand-primary hover:underline cursor-pointer">Forgot Password?</button>
                  </div>
                )}
              </>
            )}

            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-brand-primary text-white text-sm font-medium rounded-xl hover:bg-brand-secondary transition-all cursor-pointer shadow-sm hover:shadow-md">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>{mode === 'LOGIN' ? 'Sign In' : mode.includes('INIT') ? 'Send Code' : 'Verify & Complete'} <ArrowRight size={16} /></>}
            </button>
          </form>

          {mode === 'LOGIN' && (
            <>
              <p className="text-center text-sm text-text-muted mt-8">Don't have an account? <button onClick={() => setMode('SIGNUP_INIT')} className="font-semibold text-brand-primary hover:underline cursor-pointer">Sign Up</button></p>
              <div className="relative my-6 flex items-center justify-center"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200/80"></div></div><span className="relative px-3 bg-bg-surface text-xs text-text-muted font-medium">Or</span></div>
              <button onClick={triggerDemoLogin} className="w-full flex items-center justify-center gap-3 py-3 bg-brand-secondary/5 border border-brand-secondary/20 rounded-xl text-sm font-semibold text-brand-secondary hover:bg-brand-secondary/10 transition-all cursor-pointer">
                <GraduationCap size={18} /><span>Fast-Pass Demo ({selectedRole})</span>
              </button>
            </>
          )}
          {mode === 'SIGNUP_INIT' && (<p className="text-center text-sm text-text-muted mt-8">Already have an account? <button onClick={() => setMode('LOGIN')} className="font-semibold text-brand-primary hover:underline cursor-pointer">Sign In</button></p>)}
        </div>
      </main>
    </div>
  );
}