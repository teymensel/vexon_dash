import React from 'react';
import { 
  Settings, Crown, Bot, FileText, 
  Hand, LayoutGrid, Share2, 
  Gamepad2, Coins, Wallet, ShieldAlert,
  LayoutDashboard, ChevronDown
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Server } from '../types';

interface SidebarProps {
  server: Server;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ server }) => {
  const { guildId } = useParams();

  const menuItems = [
    { 
      title: 'Genel',
      items: [
        { name: 'Kontrol Paneli', icon: LayoutDashboard, path: `/dashboard/${guildId}`, active: true },
        { name: 'Ayarlar', icon: Settings, path: '#', locked: true },
        { name: 'Premium', icon: Crown, path: '/premium' },
        { name: 'Özel Bot', icon: Bot, path: '#' },
        { name: 'Gömülü Mesajlar', icon: FileText, path: '#' },
      ]
    },
    {
      title: 'Sunucu Yönetimi',
      items: [
        { name: 'Yönetim Araçları', icon: Hand, path: '#server-management' },
        { name: 'Araçlar', icon: LayoutGrid, path: '#tools' },
      ]
    },
    {
      title: 'Entegrasyonlar',
      items: [
        { name: 'Sosyal Medya', icon: Share2, path: '#social' },
        { name: 'Oyun & Eğlence', icon: Gamepad2, path: '#fun' },
        { name: 'Para Kazan', icon: Coins, path: '#monetization' },
        { name: 'Web3', icon: Wallet, path: '#web3' },
      ]
    },
    {
      title: 'Güvenlik',
      items: [
        { name: 'Güvenlik Duvarı', icon: ShieldAlert, path: '#security' },
      ]
    }
  ];

  return (
    <aside className="w-full md:w-72 bg-[#181920] border-r border-white/5 flex-shrink-0 min-h-[calc(100vh-80px)] hidden md:block overflow-y-auto sticky top-20 max-h-[calc(100vh-80px)] custom-scrollbar">
      <div className="p-4">
        {/* Server Selector */}
        <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors mb-6 group">
          <div className="flex items-center gap-3 overflow-hidden">
            {server.icon ? (
              <img src={server.icon} alt={server.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-white">
                {server.name.substring(0, 1)}
              </div>
            )}
            <span className="font-medium text-white truncate text-sm">{server.name}</span>
          </div>
          <ChevronDown size={16} className="text-gray-400 group-hover:text-white" />
        </button>

        {/* Menu Items */}
        <div className="space-y-6">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <a
                      href={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.active 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Status indicators if needed */}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;