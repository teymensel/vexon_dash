import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import {
  Hand, Gavel, ScrollText, MessageSquare,
  Smile, Tag, ShieldAlert, UserX, UserMinus,
  ChevronRight, Crown, Lock, Info, Plus,
  Workflow, MessageCircle, UserPlus, Ticket,
  Star, BarChart, Layout, Search, HelpCircle,
  Clock, BarChart2, Volume2, Twitch, Twitter,
  Youtube, Instagram, Rss, Mic, Share2,
  Gift, Cake, Music, Coins, Trophy, BrainCircuit,
  Wallet, TrendingUp, SearchCode, DollarSign,
  Activity, ListFilter, AlertTriangle, Video, Globe
} from 'lucide-react';
import { DashboardModule, Server } from '../types';
import { guildAPI } from '../lib/api';
import ModuleSettingsModal from '../components/ModuleSettingsModal';

// Base modules structure remains the same
const baseModules: Omit<DashboardModule, 'isEnabled'>[] = [
  { id: 'automation', title: 'Otomasyon', description: 'Mesajlar, tepkiler ve rol değişiklikleri gibi sunucu olaylarına yanıt olarak bot eylemlerini otomatikleştirin.', icon: Workflow, category: 'Management', isPremium: true },
  { id: 'welcome', title: 'Hoşgeldin & Hoşçakal', description: 'Yeni üyelerinize otomatik bir karşılama mesajı gönderin ve onlara roller verin.', icon: Hand, category: 'Management', isPremium: true },
  { id: 'welcome-channel', title: 'Karşılama Kanalı', description: 'Yeni üyeleri karşılamak ve gerekli bilgileri paylaşmak için özel bir yer.', icon: MessageSquare, category: 'Management', isPremium: true },
  { id: 'custom-commands', title: 'Özel Komutlar', description: 'Kendi metin komutlarınızı veya belirli roller veren komutlarınızı oluşturun', icon: MessageCircle, category: 'Management', isPremium: true },
  { id: 'reaction-roles', title: 'Tepki Rol', description: 'Bir mesaja tepki vererek üyelerinizin rol almasına izin verin', icon: Smile, category: 'Management', isPremium: true },
  { id: 'invite-tracking', title: 'Davet Takibi', description: 'Üyelerinizin topluluğunuza kaç kişi getirdiğini takip edin ve onları bir sıralama sayfasında görüntüleyin', icon: UserPlus, category: 'Management', isNew: true },
  { id: 'tickets', title: 'Talep', description: 'Üyelerinizin destek, şikayet ve öneri için talep oluşturmasına izin verin.', icon: Ticket, category: 'Management', isPremium: true },
  { id: 'starboard', title: 'Starboard', description: 'En sevilen mesajları yıldızlayarak öne çıkarın.', icon: Star, category: 'Tools', isNew: true },
  { id: 'emoji', title: 'Emoji', description: 'Sunucunuzu özel emojiler ekleyerek geliştirin', icon: Smile, category: 'Tools' },
  { id: 'polls', title: 'Anket', description: 'Üyelerinizin anket oluşturmasına ve oylamasına izin verin', icon: BarChart, category: 'Tools' },
  { id: 'embeds', title: 'Gömülü mesaj', description: 'Küçük resimler ve renklerle kurallarınız ile duyurularınız için güzel gömülü mesajları oluşturun', icon: Layout, category: 'Tools' },
  { id: 'search', title: 'Bir Şey Ara', description: 'Youtube videolarını, twitch yayıncılarını, animeleri ve daha fazlasını aramak için komutları etkinleştirin', icon: Search, category: 'Tools' },
  { id: 'help', title: 'Yardım', description: 'Sunucunuz için kontrol panelini ve yardım komutlarını etkinleştirir', icon: HelpCircle, category: 'Tools' },
  { id: 'reminder', title: 'Hatırlatıcı', description: 'Birkaç dakikada bir veya saatte bir tekrarlanan özel mesajlar gönderin', icon: Clock, category: 'Tools' },
  { id: 'stats-channels', title: 'İstatistik Kanalları', description: 'Sunucu istatistiklerinizi ve sosyal medya takipçi sayınızı sunucu kanallarınızın kenar çubuğunda gösterin', icon: BarChart2, category: 'Tools', isPremium: true },
  { id: 'temp-channels', title: 'Geçici Kanallar', description: 'Üyelerinizin tek bir tıklamayla sunucunuzda geçici sesli kanallar oluşturmasına izin verin', icon: Volume2, category: 'Tools', isPremium: true },
  { id: 'twitch', title: 'Twitch Bildirimleri', description: 'Twitch\'te canlı yayına geçtiğinizde otomatik olarak bir mesaj gönderin', icon: Twitch, category: 'Social', isPremium: true },
  { id: 'twitter', title: 'X Bildirimleri', description: 'Birisi, bir tweet gönderdiğinde otomatik olarak bir mesaj gönderin', icon: Twitter, category: 'Social', isPremium: true },
  { id: 'youtube', title: 'YouTube Bildirimleri', description: 'Birisi, bir YouTube videosu yayınladığında otomatik olarak bir mesaj gönderin', icon: Youtube, category: 'Social', isPremium: true },
  { id: 'reddit', title: 'Reddit Bildirimleri', description: 'Reddit\'te bir gönderi paylaşıldığında otomatik mesaj ile bilgilendir', icon: Share2, category: 'Social', isPremium: true },
  { id: 'instagram', title: 'Instagram Bildirimleri', description: 'Instagram hesaplarını takip edin ve yeni gönderileri için bildirim alın.', icon: Instagram, category: 'Social', isPremium: true },
  { id: 'rss', title: 'RSS Bildirimleri', description: 'RSS kaynağında yeni bir içerik yayınlandığında otomatik olarak mesaj gönderir', icon: Rss, category: 'Social' },
  { id: 'kick', title: 'Kick Bildirimleri', description: 'Birisi, canlı yayına geçtiğinde otomatik olarak bir mesaj gönderin', icon: Video, category: 'Social', isPremium: true },
  { id: 'podcast', title: 'Podcast Bildirimleri', description: 'Yeni bir podcast bölümü yayınlandığında anında öğrenin', icon: Mic, category: 'Social', isPremium: true },
  { id: 'tiktok', title: 'TikTok Bildirimleri', description: 'Birisi bir TikTok videosu yayınladığında otomatik olarak bir mesaj gönderin', icon: Video, category: 'Social', isNew: true },
  { id: 'ai', title: 'MEE6 YZ', description: 'Topluluğunuzu büyütmek ve etkileşimlerinizi arttırmak için üyelerinize YZ ile güçlendirilmiş özellikler sunun', icon: BrainCircuit, category: 'Fun' },
  { id: 'levels', title: 'Seviye', description: 'Üyelerinizin mesaj gönderdiklerinde TP ve Seviye verin ve onları aktifliklerine göre sıralama sayfasında gösterin', icon: Trophy, category: 'Fun', isPremium: true },
  { id: 'giveaway', title: 'Çekiliş', description: 'Tek bir tıklamayla sunucunuzda bir çekiliş başlatın', icon: Gift, category: 'Fun', isPremium: true },
  { id: 'birthday', title: 'Doğum Günü', description: 'Üyelerinizin doğum günlerini takip edin ve onlara otomatik olarak mutlu yıllar dileyin', icon: Cake, category: 'Fun', isPremium: true },
  { id: 'music-quiz', title: 'Müzik Testi', description: 'Ses kanallarınızda müzik testlerine girin. Şarkının adını tahmin edip puan kazanın!', icon: Music, category: 'Fun', isPremium: true },
  { id: 'economy', title: 'Ekonomi', description: 'Oyuncular !daily komutunu kullanarak günde bir kere para alabilirler', icon: Coins, category: 'Fun', isPremium: true },
  { id: 'monetization', title: 'Para Kazan', description: 'Discord sunucunuzla abonelere farklı roller, özel kanallar ve ayrıcalıklar sağlayarak gerçek para kazanın', icon: DollarSign, category: 'Monetization' },
  { id: 'nft-stats', title: 'NFT İstatistikleri', description: 'NFT koleksiyon istatistiklerini takip edin', icon: TrendingUp, category: 'Web3', isPremium: true },
  { id: 'nft-queries', title: 'NFT Sorguları', description: 'Sunucunuz üzerinden NFT koleksiyonları hakkında daha fazla bilgi edinin', icon: SearchCode, category: 'Web3' },
  { id: 'nft-sales', title: 'NFT Satış ve Listeleme', description: 'NFT Koleksiyonları için Satış ve Listeleme bilgilerini sunucunuzdan takip edin', icon: Tag, category: 'Web3' },
  { id: 'crypto-stats', title: 'Kripto İstatistikleri', description: 'Kripto para istatistiklerini takip edin', icon: Activity, category: 'Web3', isPremium: true },
  { id: 'crypto-queries', title: 'Kripto Sorguları', description: 'Sunucunuz üzerinden kripto para birimleri hakkında daha fazla bilgi edinin', icon: SearchCode, category: 'Web3' },
  { id: 'tx-tracking', title: 'İşlem takibi', description: 'İşlem Takipi, topluluğunuzun sürekli olarak güncel ücretleri takip etmesini ve en uygun fiyat için en iyi zamanı bulmasını sağlar', icon: ListFilter, category: 'Web3' },
  { id: 'gating', title: 'Sınıflandırma', description: 'NFT sahiplerine özel Discord rolleri ve kanal erişimleri verin', icon: Lock, category: 'Web3' },
  { id: 'invite-protection', title: 'Davet Koruması', description: 'Sunucunuzun Özel Davet Linki değiştirilince işlem uygular', icon: ShieldAlert, category: 'Security', isPremium: true, isLocked: true },
  { id: 'account-filter', title: 'Hesap Filtresi', description: 'Yeni hesapların sunucunuza girmesini engeller', icon: UserX, category: 'Security', isPremium: true, isLocked: true },
  { id: 'bot-filter', title: 'Bot Filtresi', description: 'Bilinmeyen botların sunucunuza girmesini engeller', icon: UserMinus, category: 'Security', isLocked: true },
  { id: 'ban-limit', title: 'Yasaklama Limiti', description: '15 dakika içinde gerçekleşebilecek yasaklama işlemlerini limitler', icon: AlertTriangle, category: 'Security', isLocked: true },
  { id: 'kick-limit', title: 'Atma Limiti', description: '15 dakika içinde gerçekleşebilecek atma işlemlerini limitler', icon: AlertTriangle, category: 'Security', isLocked: true },
  { id: 'role-limit', title: 'Rol Limitlemeleri', description: '15 dakika içinde gerçekleşebilecek rol işlemlerini limitler', icon: AlertTriangle, category: 'Security', isLocked: true },
  { id: 'channel-limit', title: 'Kanal Limitlemeleri', description: '15 dakika içinde gerçekleşebilecek kanal işlemlerini limitler', icon: AlertTriangle, category: 'Security', isLocked: true },
];

const ServerDashboard: React.FC = () => {
  const { guildId } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState<Server | null>(null);
  const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>({});
  const [config, setConfig] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<{ id: string, title: string } | null>(null);

  useEffect(() => {
    if (!guildId) return;
    fetchData();
  }, [guildId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch user guilds to find the current server info
      const guildsRes = await guildAPI.getGuilds();
      const currentServer = guildsRes.data.find((g: any) => g.id === guildId);

      if (currentServer) {
        setServer({
          id: currentServer.id,
          name: currentServer.name,
          icon: currentServer.icon ? `https://cdn.discordapp.com/icons/${currentServer.id}/${currentServer.icon}.png` : undefined,
          permission: (currentServer.permissions & 0x8) === 0x8 ? 'Admin' : 'Owner',
          hasBot: true
        });
      }

      // Fetch settings from MySQL API
      const settingsRes = await guildAPI.getSettings(guildId!);
      setEnabledModules(settingsRes.data.modules || {});
      setConfig(settingsRes.data.config || {});
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (newConfig: any) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);

    try {
      await guildAPI.saveSettings(guildId!, { modules: enabledModules, config: updatedConfig });
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const toggleModule = async (moduleId: string) => {
    const newState = !enabledModules[moduleId];
    const updatedModules = { ...enabledModules, [moduleId]: newState };

    setEnabledModules(updatedModules);

    try {
      await guildAPI.saveSettings(guildId!, { modules: updatedModules, config: config });
    } catch (err) {
      console.error('Failed to update module:', err);
      setEnabledModules(enabledModules); // Revert
    }
  };

  const getModuleGroups = () => {
    const modulesWithState = baseModules.map(m => ({
      ...m,
      isEnabled: !!enabledModules[m.id]
    }));

    return [
      { title: 'Sunucu Yönetimi', modules: modulesWithState.filter(m => m.category === 'Management'), id: 'server-management' },
      { title: 'Araçlar', modules: modulesWithState.filter(m => m.category === 'Tools'), id: 'tools' },
      { title: 'Sosyal Medya Bildirimleri', modules: modulesWithState.filter(m => m.category === 'Social'), id: 'social' },
      { title: 'Oyun & Eğlence', modules: modulesWithState.filter(m => m.category === 'Fun'), id: 'fun' },
      { title: 'Para Kazan', modules: modulesWithState.filter(m => m.category === 'Monetization'), id: 'monetization' },
      { title: 'Web3', modules: modulesWithState.filter(m => m.category === 'Web3'), id: 'web3' },
      { title: 'Güvenlik', modules: modulesWithState.filter(m => m.category === 'Security'), id: 'security' }
    ];
  };

  if (loading && !server) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1016]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!server) return <div className="min-h-screen pt-24 text-white text-center">Sunucu bulunamadı.</div>;

  return (
    <div className="flex pt-20 bg-[#0f1016] min-h-screen">
      <DashboardSidebar server={server} />

      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight size={14} />
            <Link to="/dashboard" className="hover:text-white transition-colors">Sunucularım</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium flex items-center gap-2">
              <img src={server.icon} alt="" className="w-4 h-4 rounded-full" />
              {server.name}
            </span>
          </div>

          <div className="mb-10">
            <h1 className="text-2xl font-bold text-white mb-2">Kontrol Paneli</h1>
            <p className="text-gray-400">Sunucunuzu buradan yönetin</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            getModuleGroups().map((section) => (
              section.modules.length > 0 && (
                <section key={section.title} id={section.id} className="mb-12 scroll-mt-24">
                  <h2 className="text-lg font-semibold text-white mb-4 border-b border-white/5 pb-2 inline-block">{section.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {section.modules.map((module) => (
                      <div key={module.id} className={`group relative bg-[#181920] border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 ${module.isLocked ? 'opacity-70' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg ${module.isEnabled ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10'} transition-colors`}>
                            <module.icon size={24} />
                          </div>
                          <div className="flex gap-2">
                            {module.isNew && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1">Yeni!</span>}
                            {module.isPremium && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1"><Crown size={10} fill="currentColor" /> {module.isEnabled ? '' : 'PREMIUM'}</span>}
                            {module.isEnabled && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Aktif</span>}
                            {module.isLocked && <span className="w-6 h-6 flex items-center justify-center rounded bg-white/5 text-gray-500"><Lock size={12} /></span>}
                          </div>
                        </div>
                        <h3 className="text-white font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{module.title}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed mb-4 min-h-[48px] line-clamp-3">{module.description}</p>

                        <button
                          onClick={() => {
                            if (module.isLocked) return;
                            if (module.isEnabled) {
                              setSelectedModule({ id: module.id, title: module.title });
                            } else {
                              toggleModule(module.id);
                            }
                          }}
                          disabled={module.isLocked}
                          className={`w-full py-2 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2 ${module.isEnabled
                            ? 'bg-transparent border-white/10 text-white hover:bg-white/5'
                            : module.isLocked
                              ? 'bg-white/5 text-gray-500 border-white/5 cursor-not-allowed'
                              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                          {module.isLocked ? <><Lock size={14} /> Kilitli</> : module.isEnabled ? 'Ayarlar' : <><Plus size={14} /> Etkinleştir</>}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )
            ))
          )}
        </div>

        {selectedModule && (
          <ModuleSettingsModal
            isOpen={!!selectedModule}
            onClose={() => setSelectedModule(null)}
            moduleId={selectedModule.id}
            moduleTitle={selectedModule.title}
            currentConfig={config}
            onSave={handleSaveConfig}
          />
        )}
      </main>
    </div>
  );
};

export default ServerDashboard;