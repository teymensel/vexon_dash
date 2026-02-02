import React, { useState, useEffect } from 'react';
import { Server } from '../types';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { guildAPI } from '../lib/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vexon_token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchServers();
  }, [navigate]);

  const fetchServers = async () => {
    try {
      const res = await guildAPI.getGuilds();
      const mappedServers: Server[] = res.data.map((guild: any) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : undefined,
        permission: (guild.permissions & 0x8) === 0x8 ? 'Admin' : 'Owner',
        hasBot: true // You can check this by calling your API to see if the guild is in the DB
      }));
      setServers(mappedServers);
    } catch (error) {
      console.error('Error fetching servers:', error);
      localStorage.removeItem('vexon_token');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0f1016]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Bir sunucu seçin</h1>
          <p className="text-gray-400">Sunucunuzu renklendirmeye başlayın!</p>
        </div>

        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : servers.length > 0 ? (
            servers.map((server, index) => (
              <div
                key={server.id}
                className="flex items-center justify-between p-4 bg-[#181920] border border-white/5 rounded-xl hover:border-primary/30 transition-all duration-200 group"
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