import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';
import { Calendar, Download, Search, Filter, UserCheck, Clock } from 'lucide-react';

export default function RekapKaryawan({ profile }: { profile: UserProfile | null }) {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecap();
  }, []);

  async function fetchRecap() {
    setLoading(true);
    const { data, error } = await supabase
      .from('attendances')
      .select(`
        *,
        profiles (name, email, role)
      `)
      .eq('type', 'employee')
      .order('date', { ascending: false });
    
    if (data) setAttendances(data);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main tracking-tighter">Rekap Absensi Karyawan</h1>
          <p className="text-text-muted font-medium">Laporan lengkap kehadiran Guru dan Staf.</p>
        </div>
        <button className="px-8 py-4 bg-dark-sidebar text-white font-bold rounded-2xl flex items-center justify-center hover:opacity-90 transition-all shadow-xl shadow-dark-sidebar/20">
          <Download className="mr-2" size={20} /> Export Excel
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
           <div className="relative flex-1 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" size={18} />
             <input type="text" placeholder="Cari nama karyawan..." className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-orange/10" />
           </div>
           <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
             <Filter size={20} />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Karyawan</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Memuat Rekapitulasi...</td></tr>
              ) : attendances.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada data absensi.</td></tr>
              ) : attendances.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                       <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 font-bold group-hover:bg-brand-orange group-hover:text-white transition-colors uppercase">
                          {a.profiles?.name?.charAt(0)}
                       </div>
                       <div className="ml-4">
                          <p className="text-sm font-bold text-gray-900 leading-tight">{a.profiles?.name}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{a.profiles?.role}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-sm font-bold text-gray-700">
                       <Calendar size={14} className="mr-2 text-brand-orange" />
                       {new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-500 italic">
                    {a.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
