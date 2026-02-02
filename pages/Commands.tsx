import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Command } from '../types';

const mockCommands: Command[] = [
  { name: 'ban', description: 'Bir kullanıcıyı sunucudan yasaklar.', category: 'Moderation' },
  { name: 'kick', description: 'Bir kullanıcıyı sunucudan atar.', category: 'Moderation' },
  { name: 'mute', description: 'Kullanıcının mesaj yazmasını engeller.', category: 'Moderation' },
  { name: 'clear', description: 'Belirtilen miktarda mesajı siler.', category: 'Moderation' },
  { name: 'avatar', description: 'Kullanıcının profil fotoğrafını gösterir.', category: 'Utility' },
  { name: 'user-info', description: 'Kullanıcı hakkında detaylı bilgi verir.', category: 'Utility' },
  { name: 'server-info', description: 'Sunucu istatistiklerini gösterir.', category: 'Utility' },
  { name: 'ping', description: 'Botun gecikme süresini ölçer.', category: 'Utility' },
  { name: 'daily', description: 'Günlük para ödülünü alır.', category: 'Economy' },
  { name: 'coinflip', description: 'Yazı tura atar.', category: 'Fun' },
  { name: 'rank', description: 'Seviye kartınızı gösterir.', category: 'Fun' },
  { name: 'leaderboard', description: 'En aktif üyeleri listeler.', category: 'Fun' },
];

const categories = ['All', 'Moderation', 'Utility', 'Economy', 'Fun'];

const Commands: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCommands = mockCommands.filter((cmd) => {
    const matchesSearch = cmd.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || cmd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#0f1016]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Komutlar</h1>
          <p className="text-gray-400 text-lg">Vexon'un tüm yeteneklerini keşfedin.</p>
        </div>

        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Komut arayın... (örn: ban)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Command Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <div key={cmd.name} className="bg-surface border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-colors group">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white font-mono group-hover:text-primary transition-colors">!{cmd.name}</h3>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-white/5 text-gray-400 border border-white/5">
                    {cmd.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{cmd.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Aradığınız kriterlere uygun komut bulunamadı.</p>
            </div>
          )}
        </div>
        
        {/* Ads Placeholder */}
        <div className="mt-16 flex justify-center">
            <div className="w-full max-w-4xl h-32 bg-[#12131a] rounded-xl border border-dashed border-white/10 flex items-center justify-center flex-col gap-2">
                <span className="text-gray-600 font-medium">Reklam Alanı</span>
                <span className="text-xs text-gray-700">Buraya reklam verin</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Commands;