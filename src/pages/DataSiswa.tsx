import React, { useState, useEffect } from 'react';
import { UserProfile, Student } from '../types';
import { supabase } from '../lib/supabase';
import { Plus, Search, MoreVertical, Edit2, Trash2, X, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DataSiswaProps {
  profile: UserProfile | null;
}

export default function DataSiswa({ profile }: DataSiswaProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nis: '', name: '', class_name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    const { data } = await supabase.from('students').select('*').order('name');
    if (data) setStudents(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('students').insert(formData);
      if (error) throw error;
      
      setMessage('Data siswa berhasil ditambahkan.');
      setIsModalOpen(false);
      setFormData({ nis: '', name: '', class_name: '' });
      fetchStudents();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm('Hapus data siswa ini?')) return;
    await supabase.from('students').delete().eq('id', id);
    fetchStudents();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main tracking-tighter">Master Data Siswa</h1>
          <p className="text-text-muted font-medium">Kelola database siswa untuk sistem absensi.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-brand-orange text-white font-bold rounded-2xl flex items-center justify-center hover:opacity-90 transition-all shadow-xl shadow-brand-orange/20"
        >
          <Plus className="mr-2" size={20} /> Tambah Siswa
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center shadow-sm ${message.startsWith('Error') ? 'bg-red-50 text-brand-red border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {message.startsWith('Error') ? <AlertCircle className="mr-3" /> : <CheckCircle2 className="mr-3" />}
          <span className="font-bold text-sm tracking-tight">{message}</span>
        </div>
      )}

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['TKJ', 'DKV', 'AK', 'BC'].map(dept => (
          <div key={dept} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{dept}</span>
            <span className="text-lg font-bold text-gray-900">{students.filter(s => s.class_name.includes(dept)).length} Siswa</span>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center">
           <div className="relative flex-1 max-w-md group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" size={18} />
             <input type="text" placeholder="Cari nama, kelas, atau NIS..." className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-orange/10" />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">NIS</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Kelas</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse tracking-widest">Memproses Data...</td>
                </tr>
              ) : students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-bold text-gray-500">{s.nis}</td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-900">{s.name}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-widest rounded-full">{s.class_name}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-brand-orange transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => deleteStudent(s.id)} className="p-2 text-gray-400 hover:text-brand-red transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
             >
                <div className="p-8 lg:p-10">
                   <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white"><GraduationCap size={20} /></div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Tambah Siswa Baru</h2>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
                   </div>

                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nomor Induk Siswa (NIS)</label>
                        <input 
                          type="text" 
                          required
                          value={formData.nis}
                          onChange={(e) => setFormData({...formData, nis: e.target.value})}
                          placeholder="Contoh: 2024101"
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-orange/20 rounded-2xl outline-none font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nama Lengkap</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Nama lengkap siswa..."
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-orange/20 rounded-2xl outline-none font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kelas / Jurusan</label>
                        <select 
                          required
                          value={formData.class_name}
                          onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-orange/20 rounded-2xl outline-none font-bold text-gray-900 transition-all appearance-none"
                        >
                          <option value="">Pilih Kelas</option>
                          <option value="X TKJ">X TKJ</option>
                          <option value="XI TKJ">XI TKJ</option>
                          <option value="XII TKJ">XII TKJ</option>
                          <option value="X DKV">X DKV</option>
                          <option value="XI DKV">XI DKV</option>
                          <option value="XII DKV">XII DKV</option>
                        </select>
                      </div>

                      <button 
                        type="submit"
                        disabled={submitting}
                        className="w-full py-5 bg-brand-orange text-white font-bold rounded-2xl shadow-xl shadow-orange-200 hover:bg-brand-red transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        {submitting ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Simpan Data Siswa'}
                      </button>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
