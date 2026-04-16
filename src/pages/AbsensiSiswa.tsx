import { useState, useEffect } from 'react';
import { UserProfile, Student } from '../types';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Search, GraduationCap, Check, X, AlertCircle, Save, Filter } from 'lucide-react';

interface AbsensiSiswaProps {
  profile: UserProfile | null;
}

export default function AbsensiSiswa({ profile }: AbsensiSiswaProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  async function fetchClasses() {
    const { data, error } = await supabase.from('students').select('class_name');
    if (data) {
      const uniqueClasses = Array.from(new Set(data.map(d => d.class_name)));
      setClasses(uniqueClasses);
      if (uniqueClasses.length > 0) setSelectedClass(uniqueClasses[0]);
    }
  }

  async function fetchStudents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class_name', selectedClass)
      .order('name');
    
    if (data) {
      setStudents(data);
      // Reset attendance state
      const initial: any = {};
      data.forEach(s => initial[s.id] = 'present');
      setAttendance(initial);
    }
    setLoading(false);
  }

  const toggleStatus = (studentId: string, status: any) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    setMessage(null);
    const today = new Date().toISOString().split('T')[0];

    try {
      const inserts = students.map(s => ({
        student_id: s.id,
        type: 'student',
        status: attendance[s.id],
        date: today,
        notes: `Recorded by ${profile?.name}`
      }));

      const { error } = await supabase.from('attendances').insert(inserts);
      if (error) throw error;
      
      setMessage('Berhasil menyimpan absensi siswa untuk hari ini.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.nis.includes(search)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main tracking-tighter">Input Absensi Siswa</h1>
          <p className="text-text-muted font-medium">Pilih kelas dan tentukan kehadiran siswa.</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-card space-x-2 shrink-0">
           {classes.map(c => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${selectedClass === c ? 'bg-brand-orange text-white shadow-lg shadow-orange-200' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {c}
              </button>
           ))}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center shadow-sm ${message.startsWith('Error') ? 'bg-red-50 text-brand-red border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {message.startsWith('Error') ? <AlertCircle className="mr-3" /> : <CheckCircle2 className="mr-3" />}
          <span className="font-bold text-sm tracking-tight">{message}</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" size={20} />
          <input 
            type="text" 
            placeholder="Cari Nama Siswa atau NIS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange/10 font-medium shadow-sm"
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={submitting || students.length === 0}
          className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50"
        >
          {submitting ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save className="mr-2" size={20} /> Simpan Laporan</>}
        </button>
      </div>

      {/* Student Grid */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Memuat Data Siswa...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-20 text-center space-y-2">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4">
               <Filter size={32} />
            </div>
            <p className="text-gray-900 font-bold text-lg">Tidak ada data ditemukan</p>
            <p className="text-gray-400 font-medium">Coba gunakan filter kelas lain atau pencarian berbeda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Siswa</th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Aksi Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 font-bold uppercase group-hover:bg-brand-orange group-hover:text-white transition-colors">
                          {s.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-gray-900 leading-tight">{s.name}</p>
                          <p className="text-xs text-gray-400 font-medium mt-1">NIS: {s.nis} • {s.class_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center space-x-2">
                         {[
                           { key: 'present', label: 'H', color: 'bg-green-500', bg: 'bg-green-50' },
                           { key: 'absent', label: 'A', color: 'bg-red-500', bg: 'bg-red-50' },
                           { key: 'late', label: 'T', color: 'bg-amber-500', bg: 'bg-amber-50' },
                           { key: 'excused', label: 'S', color: 'bg-blue-500', bg: 'bg-blue-50' }
                         ].map(b => (
                           <button
                             key={b.key}
                             onClick={() => toggleStatus(s.id, b.key)}
                             className={`min-w-[44px] h-11 rounded-xl font-bold transition-all border-2 ${attendance[s.id] === b.key ? `${b.color} text-white border-transparent shadow-lg scale-110` : `bg-white text-gray-300 border-gray-100 hover:border-gray-300`}`}
                           >
                             {b.label}
                           </button>
                         ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
  );
}
