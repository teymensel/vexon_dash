import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, MessageSquare, Terminal, ChevronRight, Settings, Users } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: 'Otomatik Moderasyon',
    description: 'Link engelleme, spam koruması ve yapay zeka destekli filtreleme ile sunucunuzu güvende tutun.',
    icon: Shield,
  },
  {
    title: 'Özel Bot',
    description: 'Kendi sunucunuza özel isim, avatar ve durum mesajı ile tamamen kişiselleştirilebilir bir bot deneyimi.',
    icon: Terminal,
  },
  {
    title: 'Oto Cevap',
    description: 'Belirli anahtar kelimelere otomatik yanıtlar oluşturun. Gelişmiş tetikleyiciler ile etkileşimi artırın.',
    icon: MessageSquare,
  },
  {
    title: 'Karşılama Sistemi',
    description: 'Yeni gelen üyelere özelleştirilebilir resimli mesajlar gönderin ve otomatik roller verin.',
    icon: Users,
  },
  {
    title: 'Denetim Kaydı',
    description: 'Sunucuda olup biten her şeyi detaylı bir şekilde kaydedin. Kimin ne yaptığını asla kaçırmayın.',
    icon: Settings,
  },
  {
    title: 'Hızlı ve Güvenilir',
    description: '%99.9 uptime garantisi ve düşük gecikme süresi ile kesintisiz hizmet alın.',
    icon: Zap,
  },
];

const Home: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              🎉 V 3.0 Yayında: Daha Hızlı, Daha Güçlü
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Discord için ihtiyacınız olan <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                tek botla tanışın
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Birçok özellik barındıran ve her geçen gün daha da yükselen Vexon ile sunucunuzu renklendirin ve yönetimini kolaylaştırın.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2">
                Discord'a Ekle
                <ChevronRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-surface hover:bg-white/5 text-white font-semibold rounded-xl border border-white/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                Kontrol Paneli
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10"
          >
            {[
              { label: 'Sunucu', value: '15K+' },
              { label: 'Kullanıcı', value: '2.5M+' },
              { label: 'Komut', value: '150+' },
              { label: 'Uptime', value: '%99.9' },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
                <span className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0a0b0f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ve çok daha fazlası...</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Vexon, moderasyondan eğlenceye kadar her ihtiyacınızı karşılamak için tasarlandı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-surface border border-white/5 hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-secondary p-12 text-center shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
              Sunucunu dönüştürmeye hazır mısın?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Hemen şimdi Vexon'u sunucuna ekle ve binlerce mutlu sunucu sahibinin arasına katıl. Kurulum sadece 1 dakika sürer.
            </p>
            <button className="px-10 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors relative z-10">
              Hemen Başla
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;