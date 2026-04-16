import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { UserCheck, GraduationCap, Users, Calendar, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile | null;
}

export default function Dashboard({ profile }: DashboardProps) {
  const stats = [
    { label: 'Total Siswa', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Kehadiran Siswa', value: '94%', icon: GraduationCap, color: 'text-brand-orange', bg: 'bg-orange-100' },
    { label: 'Kehadiran Karyawan', value: '98%', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Card replaced with Hero Section from design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="hero-bold text-text-main">
          Halo, <span className="text-brand-orange">{profile?.name?.split(' ')[0] || 'Admin'}.</span>
        </h1>
        <p className="text-text-muted font-medium text-lg">Pantau kehadiran harian SMK Prima Unggul dalam satu tampilan.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card hover:shadow-md transition-shadow group"
          >
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] mb-2 block">{stat.label}</span>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-extrabold text-text-main leading-none tracking-tight">{stat.value}</h3>
              <div className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">
                ↑ 2.5%
              </div>
            </div>
          </motion.div>
        ))}
        {/* Added one more stat card from design to match 4 cols */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card hover:shadow-md transition-shadow group"
          >
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] mb-2 block">Hadir (GURU)</span>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-extrabold text-text-main leading-none tracking-tight">82/86</h3>
              <div className="text-xs font-bold text-brand-red bg-red-50 px-2 py-1 rounded-md">
                ↓ 4
              </div>
            </div>
          </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
           <div className="bg-white rounded-[20px] p-8 border border-gray-100 shadow-card">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-text-main">Kehadiran Terbaru (Siswa)</h2>
                <button className="text-xs font-bold text-brand-orange uppercase tracking-widest hover:text-brand-red">Lihat Semua</button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="text-left">
                     <th className="pb-4 text-[11px] font-bold text-text-muted uppercase tracking-widest border-b border-gray-50">Nama Siswa</th>
                     <th className="pb-4 text-[11px] font-bold text-text-muted uppercase tracking-widest border-b border-gray-50">Kelas</th>
                     <th className="pb-4 text-[11px] font-bold text-text-muted uppercase tracking-widest border-b border-gray-50">Waktu</th>
                     <th className="pb-4 text-[11px] font-bold text-text-muted uppercase tracking-widest border-b border-gray-50">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {[
                      { name: 'Aditya Pratama', class: 'XII TKJ 1', time: '06:45 AM', status: 'HADIR' },
                      { name: 'Siti Aminah', class: 'XI DKV 2', time: '06:52 AM', status: 'HADIR' },
                      { name: 'Budi Santoso', class: 'X AK 1', time: '07:05 AM', status: 'HADIR' },
                      { name: 'Dewi Lestari', class: 'XII MPLB', time: '07:10 AM', status: 'HADIR' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="py-4 text-sm font-bold text-text-main">{row.name}</td>
                        <td className="py-4 text-sm text-text-muted font-medium">{row.class}</td>
                        <td className="py-4 text-sm text-text-muted font-medium">{row.time}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-md text-[11px] font-bold uppercase">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>

        <div>
           <div className="bg-gradient-to-br from-brand-orange to-brand-red rounded-[20px] p-8 text-white shadow-xl shadow-brand-orange/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1 tracking-tight">Program Keahlian</h3>
                <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-6">Statistik Per Jurusan</p>
                
                <div className="space-y-4">
                  {[
                    { label: 'TKJ', value: '240' },
                    { label: 'DKV', value: '180' },
                    { label: 'AK', value: '210' },
                    { label: 'BC', value: '160' },
                    { label: 'MPLB', value: '250' },
                    { label: 'BD', value: '200' }
                  ].map((dept, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                       <span className="text-sm font-bold">{dept.label}</span>
                       <span className="text-sm font-bold opacity-80">{dept.value} Siswa</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-white/10 p-4 rounded-xl text-[11px] font-medium leading-relaxed border border-white/10">
                  <strong>Quick Tip:</strong> Gunakan menu User Management untuk sinkronisasi data Supabase Auth.
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
