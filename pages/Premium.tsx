import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { PricingPlan } from '../types';

const plans: PricingPlan[] = [
  {
    name: 'Standart',
    price: 'Ücretsiz',
    features: [
      'Temel Moderasyon',
      'Standart Oto Cevap (15 adet)',
      'Basit Denetim Kaydı',
      'Müzik Sistemi (Düşük Kalite)',
      'Topluluk Desteği'
    ],
    buttonText: 'Ekle',
  },
  {
    name: 'Premium',
    price: '99 TRY',
    features: [
      'Gelişmiş Güvenlik Sistemleri',
      'Oto Cevap Limiti (150 adet)',
      'Öncelikli Destek',
      'Yüksek Kalite Müzik',
      'Oy Zorunluluğu Yok',
      'Gelişmiş Sunucu İstatistikleri',
      '7 Gün İade Garantisi'
    ],
    recommended: false,
    buttonText: 'Satın Al',
  },
  {
    name: 'Özel Bot',
    price: '250 TRY',
    features: [
      'Tamamen Kişiselleştirilmiş Bot',
      'Özel İsim, Avatar ve Durum',
      'Tüm Premium Özellikler Dahil',
      '20 Sunucuda Kullanılabilir',
      '%99.9 Aktiflik Süresi',
      'Özel Yönetim Paneli',
      '7 Gün İade Garantisi'
    ],
    recommended: true,
    buttonText: 'Satın Al',
  }
];

const Premium: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0f1016]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Vexon Premium</h1>
          <p className="text-gray-400 text-lg mb-8">Premium özelliklerle sunucunuzu bambaşka bir seviyeye taşıyın.</p>
          
          <div className="flex items-center justify-center gap-4">
             <div className="bg-surface p-1 rounded-lg border border-white/10 flex relative">
                <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Aylık
                </button>
                <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Yıllık
                </button>
                {/* Discount Badge */}
                <div className="absolute -top-3 -right-6 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
                    %20 İNDİRİM
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative rounded-2xl p-8 border flex flex-col ${
                plan.recommended 
                  ? 'bg-gradient-to-b from-[#1e1b4b] to-[#0f1016] border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10' 
                  : 'bg-surface border-white/5'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star size={12} fill="currentColor" /> EN POPÜLER
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-lg font-medium mb-2 ${plan.recommended ? 'text-primary' : 'text-gray-300'}`}>
                    {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.price !== 'Ücretsiz' && <span className="text-gray-500">/ay</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.recommended ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-400'}`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-bold transition-all ${
                plan.recommended
                  ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center bg-surface border border-white/5 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">Hala emin değil misin?</h3>
            <p className="text-gray-400 mb-6">Premium özellikleri 3 gün boyunca ücretsiz dene. Kart bilgisi gerekmez.</p>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-white font-medium transition-colors">
                Ücretsiz Denemeyi Başlat
            </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;