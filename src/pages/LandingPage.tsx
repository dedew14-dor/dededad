import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Users, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function LandingPage() {
  const departments = [
    { name: 'TKJ', desc: 'Teknik Komputer & Jaringan' },
    { name: 'DKV', desc: 'Desain Komunikasi Visual' },
    { name: 'AK', desc: 'Akuntansi' },
    { name: 'BC', desc: 'Broadcasting' },
    { name: 'MPLB', desc: 'Manajemen Perkantoran & Layanan Bisnis' },
    { name: 'BD', desc: 'Bisnis Digital' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">SMK Prima Unggul</span>
        </div>
        <Link 
          to="/login" 
          className="px-6 py-2 bg-brand-orange text-white font-semibold rounded-full hover:bg-brand-red transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Masuk ke Aplikasi
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-sm font-bold mb-6">
            <ShieldCheck size={16} className="mr-2" />
            Sistem Absensi Terintegrasi
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Membangun Kedisiplinan di <span className="text-brand-orange">Era Digital.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Sistem absensi modern untuk siswa dan tenaga pengajar SMK Prima Unggul. 
            Cepat, akurat, dan transparan untuk mendukung ekosistem pendidikan yang lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all group"
            >
              Coba Sekarang
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center space-x-4 px-6 py-4 bg-gray-50 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-gray-600 font-medium whitespace-nowrap">Status: Aktif & Siaga</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-brand-orange to-brand-red rounded-[2rem] p-4 shadow-2xl skew-y-3">
             <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 -skew-y-3">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">98.5%</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Kehadiran Hari Ini</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'Siswa Hadir', value: 842, color: 'bg-brand-orange' },
                    { label: 'Guru Hadir', value: 45, color: 'bg-brand-red' },
                    { label: 'Staf Hadir', value: 12, color: 'bg-gray-900' }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-sm font-bold">
                         <span>{stat.label}</span>
                         <span>{stat.value}</span>
                       </div>
                       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '85%' }}
                           transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                           className={`h-full ${stat.color}`}
                         />
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </motion.div>
      </main>

      {/* Departments Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">6 Program Keahlian Unggulan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Memfasilitasi minat dan bakat siswa di berbagai bidang industri kreatif dan teknologi masa kini.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-brand-orange transition-colors group"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.name}</h3>
                <p className="text-gray-500 leading-relaxed">{dept.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Profile Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <GraduationCap className="text-brand-orange" />
            <span className="font-bold text-gray-900 uppercase tracking-tighter">Profile SMK Prima Unggul</span>
          </div>
          <div className="flex items-center space-x-6 text-gray-500 text-sm">
             <div className="flex items-center"><MapPin size={16} className="mr-2" /> Jakarta, Indonesia</div>
             <div className="flex items-center"><Users size={16} className="mr-2" /> 1000+ Siswa Terdaftar</div>
          </div>
          <p className="text-gray-400 text-sm">© 2024 SMK Prima Unggul. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
