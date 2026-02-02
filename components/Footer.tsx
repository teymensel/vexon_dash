import React from 'react';
import { Rocket, Twitter, Github, Disc } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-[#0a0b0f] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
                <Rocket className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white">Vexon</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discord sunucunuzu yönetmenin en modern ve güvenli yolu. Vexon ile topluluğunuzu bir üst seviyeye taşıyın.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Ürün</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Premium</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Komutlar</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Güncellemeler</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kaynaklar</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Destek Sunucusu</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Dokümantasyon</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kullanım Şartları</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Bizi Takip Et</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                <Disc size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Vexon Bot. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-400">Tüm sistemler aktif</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;