import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Clock, MapPin, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface AbsensiKaryawanProps {
  profile: UserProfile | null;
}

export default function AbsensiKaryawan({ profile }: AbsensiKaryawanProps) {
  const [loading, setLoading] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    checkTodayStatus();
  }, [profile]);

  async function checkTodayStatus() {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .eq('user_id', profile.id)
      .eq('type', 'employee')
      .eq('date', today)
      .maybeSingle();

    if (data) {
      setHasCheckedIn(true);
      setLastCheckIn(data);
    }
  }

  const handleAbsen = async () => {
    if (!profile) return;
    setLoading(true);
    setMessage(null);

    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    try {
      const { error } = await supabase.from('attendances').insert({
        user_id: profile.id,
        type: 'employee',
        status: 'present',
        date: today,
        notes: `Checked in at ${time} WIB`
      });

      if (error) throw error;
      
      setHasCheckedIn(true);
      setMessage(`Berhasil melakukan absensi masuk pada ${time} WIB.`);
      checkTodayStatus();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main tracking-tighter">Presensi Mandiri</h1>
          <p className="text-text-muted font-medium">Lakukan absensi harian Anda di sini.</p>
        </div>
        <div className="flex items-center space-x-3 px-5 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-card">
           <Calendar size={18} className="text-brand-orange" />
           <span className="text-sm font-bold text-gray-700">
             {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
           </span>
        </div>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-center shadow-sm ${message.startsWith('Error') ? 'bg-red-50 text-brand-red border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}
        >
          {message.startsWith('Error') ? <AlertCircle className="mr-3" /> : <CheckCircle2 className="mr-3" />}
          <span className="font-bold text-sm tracking-tight">{message}</span>
        </motion.div>
      )}

      <div className="grid md:grid-cols-5 gap-8">
        {/* Absen Card */}
        <div className="md:col-span-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl p-10 shadow-xl border relative overflow-hidden flex flex-col items-center justify-center text-center space-y-8 h-full transition-all duration-500 ${hasCheckedIn ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}
          >
             <div className="relative">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 scale-100 ${hasCheckedIn ? 'bg-green-100 text-green-600 scale-110' : 'bg-orange-100 text-brand-orange animate-pulse'}`}>
                  {hasCheckedIn ? <CheckCircle2 size={64} /> : <Clock size={64} />}
                </div>
                {!hasCheckedIn && <div className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">Wajib Absen</div>}
             </div>

             <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {hasCheckedIn ? 'Sudah Absen Hari Ini' : 'Waktunya Presensi'}
                </h3>
                <p className="text-gray-500 font-medium max-w-xs mx-auto">
                  {hasCheckedIn 
                    ? `Status Anda hari ini: Hadir. Sampai jumpa besok!` 
                    : 'Akses lokasi Anda aktif. Klik tombol di bawah untuk mencatat kehadiran.'}
                </p>
             </div>

             <button
               onClick={handleAbsen}
               disabled={loading || hasCheckedIn}
               className={`w-full max-w-sm py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-3 shadow-xl ${hasCheckedIn ? 'bg-green-600 text-white shadow-green-200 cursor-default' : 'bg-brand-orange text-white hover:bg-brand-red shadow-orange-200'}`}
             >
               {loading ? (
                 <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
               ) : hasCheckedIn ? (
                 <><span>Hadir</span></>
               ) : (
                 <>
                   <MapPin size={24} />
                   <span>Presensi Sekarang</span>
                 </>
               )}
             </button>

             {/* Background Decoration */}
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl"></div>
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Riwayat Singkat</h4>
              <div className="space-y-6">
                 {[ 
                   { day: 'Kamis', date: '16 Apr', time: '07:45', status: 'Hadir' },
                   { day: 'Rabu', date: '15 Apr', time: '07:54', status: 'Hadir' },
                   { day: 'Selasa', date: '14 Apr', time: '08:10', status: 'Terlambat' },
                 ].map((h, i) => (
                   <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                            <span className="text-[10px] font-bold uppercase leading-none">{h.day.slice(0,3)}</span>
                            <span className="text-sm font-extrabold leading-none mt-1">{h.date.split(' ')[0]}</span>
                         </div>
                         <div className="ml-4">
                            <p className="text-sm font-bold text-gray-900">{h.time} WIB</p>
                            <p className="text-xs text-gray-500 font-medium">Presensi Masuk</p>
                         </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${h.status === 'Hadir' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-brand-red'}`}>
                        {h.status}
                      </span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl shadow-gray-200 relative overflow-hidden group">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Informasi Penting</h4>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Batas waktu presensi masuk adalah pukul <span className="text-brand-orange font-bold">08:00 WIB</span>. 
                Pastikan GPS Anda aktif dan akurat sebelum menekan tombol.
              </p>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-700" />)}
                <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-brand-orange flex items-center justify-center text-[10px] font-bold">+5</div>
              </div>
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-brand-orange/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
