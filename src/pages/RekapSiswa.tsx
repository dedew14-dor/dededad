import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';
import { Calendar, Download, Search, Filter, GraduationCap, MapPin } from 'lucide-react';

export default function RekapSiswa({ profile }: { profile: UserProfile | null }) {
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
        students (name, nis, class_name)
      `)
      .eq('type', 'student')
      .order('date', { ascending: false });
    
    if (data) setAttendances(data);
    setLoading(false);
  }

  const getStatusBadge = (status: string) => {
    const styles: any = {
      present: 'bg-green-50 text-green-600',
      absent: 'bg-red-50 text-red-600',
      late: 'bg-amber-50 text-amber-600',
      excused: 'bg-blue-50 text-blue-600'
    };
    const labels: any = {
      present: 'Hadir',
      absent: 'Alpa',
      late: 'Telat',
      excused: 'Sakit/Izin'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main tracking-tighter">Rekap Absensi Siswa</h1>
          <p className="text-text-muted font-medium">Laporan kehadiran siswa per kelas dan tanggal.</p>
        </div>
        <button className="px-8 py-4 bg-dark-sidebar text-white font-bold rounded-2xl flex items-center justify-center hover:opacity-90 transition-all shadow-xl shadow-dark-sidebar/20">
          <Download className="mr-2" size={20} /> Cetak Laporan
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
           <div className="relative flex-1 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" size={18} />
             <input type="text" placeholder="Cari nama siswa atau NIS..." className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-orange/10" />
           </div>
           <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {['Harian', 'Mingguan', 'Bulanan'].map(f => (
                <button key={f} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${f === 'Harian' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{f}</button>
              ))}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Siswa</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Kelas</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Menyusun Laporan...</td></tr>
              ) : attendances.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada data absensi siswa.</td></tr>
              ) : attendances.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                       <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 font-bold group-hover:bg-brand-red group-hover:text-white transition-colors uppercase">
                          {a.students?.name?.charAt(0)}
                       </div>
                       <div className="ml-4">
                          <p className="text-sm font-bold text-gray-900 leading-tight">{a.students?.name}</p>
                          <p className="text-xs text-gray-400 font-bold tracking-tight mt-1">NIS: {a.students?.nis}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-gray-600">{a.students?.class_name}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-500">
                    {new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5">
                    {getStatusBadge(a.status)}
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
