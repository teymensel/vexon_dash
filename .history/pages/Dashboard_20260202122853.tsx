import React, { useState, useEffect } from 'react';
import { Server } from '../types';
import { ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

const mockServers: Server[] = [
  { id: '1', name: 'Keyif Köşesi', permission: 'Admin', hasBot: true, icon: 'https://cdn.discordapp.com/icons/768953372295626762/a_e0c7042858b76c6418816c192d197607.webp' },
  { id: '2', name: 'S K Y D A R K #YETKİLİALIM', permission: 'Owner', hasBot: true, icon: 'https://cdn.discordapp.com/icons/705469956463951932/a_5b513364233767228892697841c73852.webp' },
  { id: '3', name: 'Sakarya Üniversitesi Yazılım', permission: 'Owner', hasBot: true, icon: 'https://cdn.discordapp.com/icons/101890123545123567/234.png' },
  { id: '4', name: 'Vexon Support', permission: 'Admin', hasBot: true },
  { id: '5', name: 'Test Server 1', permission: 'Owner', hasBot: false },
  { id: '6', name: 'Oyun Alanı', permission: 'Admin', hasBot: false },
  { id: '7', name: 'Code Share', permission: 'Owner', hasBot: false },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
      setUser(session.user);
      fetchServers(session.access_token);
    };

    checkUser();
  }, [navigate]);

  const fetchServers = async (accessToken: string) => {
    try {
      const response = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        const mappedServers: Server[] = data
          .filter((guild: any) => (guild.permissions & 0x8) === 0x8 || (guild.permissions & 0x20) === 0x20) // Admin or Manage Guild
          .map((guild: any) => ({
            id: guild.id,
            name: guild.name,
            icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : undefined,
            permission: (guild.permissions & 0x8) === 0x8 ? 'Admin' : 'Owner',
            hasBot: false // We will check this against our DB or via Bot API
          }));
        setServers(mappedServers);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0f1016]">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Bir sunucu seçin</h1>
          <p className="text-gray-400">Sunucunuzu renklendirmeye başlayın!</p>
        </div>

        {/* Ad Banner */}
        <div className="relative w-full h-40 md:h-48 bg-gradient-to-r from-[#181920] to-[#0f1016] rounded-2xl border border-white/5 mb-12 flex items-center justify-between px-8 md:px-12 overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>

          <div className="relative z-10">
            <span className="text-green-400 text-xs font-bold tracking-wider uppercase mb-1 block">Yükselişe Geçin</span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">BU ALANA <br /> REKLAM VERİN</h3>
            <p className="text-gray-500 text-xs md:text-sm">Yüzlerce yeni üyeye ulaşın</p>
          </div>

          <div className="relative z-10 hidden sm:flex items-center justify-center w-16 h-16 bg-white/5 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-300">
            <span className="text-gray-400 text-xs font-bold">REKLAM</span>
          </div>

          {/* Decorative shine */}
          <div className="absolute top-0 -right-full w-full h-full bg-gradient-to-l from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shimmer" />
        </div>

        {/* Server List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : servers.length > 0 ? (
            servers.map((server, index) => (
              <div
                key={server.id}
                className="flex items-center justify-between p-4 bg-[#181920] border border-white/5 rounded-xl hover:border-primary/30 transition-all duration-200 group animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    {server.icon ? (
                      <img
                        src={server.icon}
                        alt={server.name}
                        className="w-full h-full rounded-full object-cover ring-2 ring-white/5 group-hover:ring-primary/50 transition-all"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ring-2 ring-white/5 group-hover:ring-primary/50 transition-all">
                        <span className="text-lg font-bold text-gray-400">{server.name.substring(0, 1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-white font-medium text-base truncate max-w-[150px] sm:max-w-xs">{server.name}</span>
                    <span className="text-xs text-gray-500">{server.permission}</span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => navigate(`/dashboard/${server.id}`)}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 min-w-[100px]"
                  >
                    Yönet
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-[#181920] rounded-xl border border-white/5">
              <p className="text-gray-400 mb-4">Hiç yetkili olduğunuz sunucu bulunamadı.</p>
              <button
                onClick={() => window.open('https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands', '_blank')}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
              >
                Botu Sunucuna Ekle
              </button>
            </div>
          )}

          {/* Add Server Placehoder */}
          <div className="mt-4 flex justify-center">
            <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium">
              <Plus size={16} />
              Farklı bir sunucu ekle
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;