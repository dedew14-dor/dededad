import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  Settings, 
  LogOut,
  GraduationCap,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserProfile } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AppLayoutProps {
  profile: UserProfile | null;
}

export default function AppLayout({ profile }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/app', 
      roles: ['admin', 'guru', 'staf'] 
    },
    { 
      title: 'Absensi Karyawan', 
      icon: UserCheck, 
      path: '/app/absensi-karyawan', 
      roles: ['admin', 'guru', 'staf'] 
    },
    { 
      title: 'Absensi Siswa', 
      icon: GraduationCap, 
      path: '/app/absensi-siswa', 
      roles: ['admin', 'guru'] 
    },
    { 
      title: 'Data Siswa', 
      icon: Users, 
      path: '/app/data-siswa', 
      roles: ['admin'] 
    },
    { 
      title: 'Rekap Karyawan', 
      icon: ClipboardList, 
      path: '/app/rekap-karyawan', 
      roles: ['admin'] 
    },
    { 
      title: 'Rekap Siswa', 
      icon: FileText, 
      path: '/app/rekap-siswa', 
      roles: ['admin', 'guru'] 
    },
    { 
      title: 'User Management', 
      icon: Settings, 
      path: '/app/user-management', 
      roles: ['admin'] 
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-dark-sidebar text-white/60 border-r border-white/5 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-20 px-8">
            <span className="text-xl font-extrabold tracking-tighter text-brand-orange">SMK PRIMA UNGGUL</span>
            <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-8 py-3.5 text-sm font-medium transition-all duration-200",
                  location.pathname === item.path
                    ? "sidebar-gradient-active text-white border-l-4 border-brand-orange pl-7"
                    : "hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 opacity-70" />
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Version Info (from design) */}
          <div className="p-8 text-[11px] font-bold opacity-30 tracking-widest uppercase">
            v2.0.4 • ADMIN PANEL
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-20 px-10 bg-white border-b border-gray-100">
          <div className="flex items-center">
            <button 
              className="p-2 text-gray-600 lg:hidden" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="ml-4 text-2xl font-extrabold text-text-main tracking-tight lg:ml-0">
              {menuItems.find(i => i.path === location.pathname)?.title || 'Dashboard'}
            </h1>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center px-6 py-2.5 bg-brand-red text-white text-xs font-bold rounded-lg uppercase tracking-wider hover:opacity-90 transition-all"
          >
            Sign Out
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-10 bg-bg-light">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
