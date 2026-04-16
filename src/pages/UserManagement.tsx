import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { UserPlus, Shield, User, Trash2, Mail, BadgeCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface UserManagementProps {
  profile: UserProfile | null;
}

export default function UserManagement({ profile }: UserManagementProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return;
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      
      // Note: Actually deleting from Supabase Auth requires Admin SDK/Edge Function
      // Here we just delete the profile.
      setMessage('Profil pengguna berhasil dihapus dari database.');
      fetchUsers();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main tracking-tighter">Manajemen Pengguna</h1>
          <p className="text-text-muted font-medium">Atur hak akses guru dan tenaga kependidikan.</p>
        </div>
        <button className="px-8 py-4 bg-dark-sidebar text-white font-bold rounded-2xl flex items-center justify-center hover:opacity-90 transition-all shadow-xl shadow-dark-sidebar/20">
          <UserPlus className="mr-2" size={20} /> Tambah User
        </button>
      </div>

      {message && (
        <div className="p-4 bg-orange-50 text-brand-orange border border-orange-100 rounded-2xl flex items-center font-bold text-sm">
           <AlertCircle className="mr-3" /> {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => (
             <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm animate-pulse">
                <div className="w-16 h-16 bg-gray-100 rounded-full mb-4" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-50 rounded w-3/4" />
             </div>
          ))
        ) : users.map((u) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all relative group overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 transition-colors ${u.role === 'admin' ? 'bg-brand-orange' : u.role === 'guru' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white font-bold text-xl shadow-lg ${u.role === 'admin' ? 'bg-brand-orange' : u.role === 'guru' ? 'bg-blue-500' : 'bg-gray-600'}`}>
                  {u.name.charAt(0)}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center ${u.role === 'admin' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-blue-600'}`}>
                  {u.role === 'admin' ? <Shield size={10} className="mr-1" /> : <User size={10} className="mr-1" />}
                  {u.role}
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <div className="flex items-center space-x-1">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{u.name}</h3>
                  <BadgeCheck size={16} className="text-blue-500 shrink-0" />
                </div>
                <div className="flex items-center text-gray-400 text-sm font-medium">
                  <Mail size={14} className="mr-2" />
                  <span className="truncate">{u.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Terdaftar {new Date(u.created_at).toLocaleDateString('id-ID')}</span>
                <div className="flex space-x-2">
                   <button 
                    onClick={() => handleDelete(u.id)}
                    className="p-2 text-gray-400 hover:text-brand-red transition-colors"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
