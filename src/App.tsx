import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { UserProfile } from './types';

// Pages (will create these next)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AbsensiKaryawan from './pages/AbsensiKaryawan';
import AbsensiSiswa from './pages/AbsensiSiswa';
import RekapKaryawan from './pages/RekapKaryawan';
import RekapSiswa from './pages/RekapSiswa';
import DataSiswa from './pages/DataSiswa';
import UserManagement from './pages/UserManagement';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
      } else {
        // If profile doesn't exist, it might be the first user (admin) or we need to wait for trigger
        // For this demo, we'll assume the role based on session or manual creation
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex bg-gray-50 items-center justify-center min-vh-100 h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/app" />} />
        
        <Route path="/app" element={user ? <AppLayout profile={profile} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard profile={profile} />} />
          <Route path="absensi-karyawan" element={<AbsensiKaryawan profile={profile} />} />
          <Route path="absensi-siswa" element={<AbsensiSiswa profile={profile} />} />
          <Route path="rekap-karyawan" element={<RekapKaryawan profile={profile} />} />
          <Route path="rekap-siswa" element={<RekapSiswa profile={profile} />} />
          <Route path="data-siswa" element={<DataSiswa profile={profile} />} />
          <Route path="user-management" element={<UserManagement profile={profile} />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

