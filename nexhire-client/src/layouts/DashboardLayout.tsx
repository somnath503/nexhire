import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Users, LayoutDashboard, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', role: 'RECRUITER', initials: 'SP' });

  useEffect(() => {
    const storedUser = localStorage.getItem('nexhire_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const generatedInitials = parsed.email ? parsed.email.substring(0, 2).toUpperCase() : 'SP';
      setUser({ ...parsed, initials: generatedInitials });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nexhire_token');
    localStorage.removeItem('nexhire_user');
    navigate('/login');
  };

  const recruiterNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Candidates', path: '/candidates', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const candidateNav = [
    { name: 'My Applications', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Profile Settings', path: '/settings', icon: Settings },
  ];

  const navItems = user.role === 'CANDIDATE' ? candidateNav : recruiterNav;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-app w-full">
      
      {/* TOP NAVBAR (Professional Header) */}
      <header className="h-16 bg-bg-surface border-b border-gray-200 flex items-center justify-between px-6 shadow-xs z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            N
          </div>
          <h1 className="text-xl font-bold text-brand-primary tracking-tight">NexHire</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-main">{user.email || 'Guest User'}</p>
            <p className="text-xs text-brand-primary font-semibold">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-secondary text-white flex items-center justify-center text-sm font-medium shadow-sm border-2 border-white ring-2 ring-gray-100 uppercase">
            {user.initials}
          </div>
        </div>
      </header>

      {/* BOTTOM SECTION (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Floating Hover Sidebar */}
        <aside className="group w-20 hover:w-64 flex flex-col bg-bg-surface border-r border-gray-200 transition-all duration-300 ease-in-out absolute left-0 top-0 h-full z-40 shadow-sm hover:shadow-xl">
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-x-hidden">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors duration-200 ${
                    isActive ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-muted hover:bg-gray-50 hover:text-text-main'
                  }`}
                >
                  <Icon size={22} className="shrink-0" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <button onClick={handleLogout} className="flex items-center gap-4 w-full px-3 py-3 text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl overflow-hidden cursor-pointer">
              <LogOut size={22} className="shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8 bg-bg-app ml-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}