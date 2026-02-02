import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface ModuleSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    moduleId: string;
    moduleTitle: string;
    currentConfig: any;
    onSave: (config: any) => void;
}

const ModuleSettingsModal: React.FC<ModuleSettingsModalProps> = ({
    isOpen, onClose, moduleId, moduleTitle, currentConfig, onSave
}) => {
    const [config, setConfig] = useState(currentConfig || {});

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#181920] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white">{moduleTitle} Ayarları</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {moduleId === 'welcome' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Karşılama Kanalı ID</label>
                                <input
                                    type="text"
                                    value={config.welcome_channel_id || ''}
                                    onChange={(e) => setConfig({ ...config, welcome_channel_id: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="Kanal ID"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Hoşgeldin Mesajı</label>
                                <textarea
                                    value={config.welcome_message || ''}
                                    onChange={(e) => setConfig({ ...config, welcome_message: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors min-h-[100px]"
                                    placeholder="Mesajınızı girin..."
                                />
                            </div>
                        </>
                    )}

                    {/* Add more module-specific fields here */}
                    {moduleId !== 'welcome' && (
                        <div className="py-8 text-center text-gray-500">
                            Bu modül için henüz özel ayar bulunmamaktadır.
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white/5 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-lg text-sm font-medium border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={() => {
                            onSave(config);
                            onClose();
                        }}
                        className="flex-1 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={16} /> Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModuleSettingsModal;
