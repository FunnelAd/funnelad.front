'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/presentation/components/ProtectedRoute';
import { useTranslation } from 'react-i18next';
import '@/i18n';

// Simulación de plantillas de bienvenida
const WELCOME_TEMPLATES = [
  { id: '1', name: 'Bienvenida estándar', content: '¡Hola! ¿En qué puedo ayudarte hoy?' },
  { id: '2', name: 'Bienvenida formal', content: 'Bienvenido a nuestro servicio, ¿cómo puedo asistirle?' },
];

const TABS = [
  { key: 'general', label: 'general' },
  { key: 'integrations', label: 'integrations' },
];

export default function CreateAssistantPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    welcomeTemplateId: '',
    isActive: true,
    responseTime: 30,
    responseType: 80,
    messageSendType: 'por_partes',
    useEmojis: false,
    useStyles: false,
    audioVoice: '',
    audioCount: 0,
    replyAudioWithAudio: false,
    whatsappNumber: '',
    whatsappBusinessId: '',
    metaAppId: '',
    metaToken: '',
    webhookUrl: '',
    webhookToken: '',
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert(t('save') + ':\n' + JSON.stringify(form, null, 2));
    router.push('/assistants');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0B2C3D] py-8 px-2 sm:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Selector de idioma */}
          <div className="flex justify-end mb-4">
            <button onClick={() => i18n.changeLanguage('es')} className={`px-3 py-1 rounded-l bg-white/80 text-[#0B2C3D] font-bold border border-[#C9A14A] ${i18n.language === 'es' ? 'bg-[#C9A14A] text-white' : ''}`}>ES</button>
            <button onClick={() => i18n.changeLanguage('en')} className={`px-3 py-1 rounded-r bg-white/80 text-[#0B2C3D] font-bold border border-[#C9A14A] border-l-0 ${i18n.language === 'en' ? 'bg-[#C9A14A] text-white' : ''}`}>EN</button>
          </div>
          <h2 className="text-3xl font-bold mb-8 text-white tracking-tight flex items-center gap-3">
            <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A14A] to-[#A8842C] flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 12c0-2.21 1.79-4 4-4h2V6a3 3 0 1 1 6 0v2h2a4 4 0 1 1 0 8h-2v2a3 3 0 1 1-6 0v-2H7a4 4 0 0 1-4-4Z" fill="#fff"/></svg>
            </span>
            {t('new_assistant')}
          </h2>

          {/* Tabs */}
          <div className="flex border-b border-[#C9A14A]/30 mb-8">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 -mb-px border-b-2 transition-colors duration-200 font-semibold text-lg focus:outline-none ${
                  activeTab === tab.key
                    ? 'border-[#C9A14A] text-[#C9A14A] bg-[#0B2C3D]'
                    : 'border-transparent text-[#B0B6BE] hover:text-[#C9A14A] bg-[#0B2C3D]'
                }`}
              >
                {t(tab.label)}
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-8 space-y-8">
            {activeTab === 'general' && (
              <form className="space-y-8">
                {/* General */}
                <div>
                  <h3 className="text-xl font-bold text-[#C9A14A] mb-4">{t('general')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[#0B2C3D] font-semibold mb-1">{t('assistant_name')}</label>
                      <input className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.name} onChange={e => handleChange('name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[#0B2C3D] font-semibold mb-1">{t('phone')}</label>
                      <input className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[#0B2C3D] font-semibold mb-1">{t('welcome_message')}</label>
                      <select className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.welcomeTemplateId} onChange={e => handleChange('welcomeTemplateId', e.target.value)}>
                        <option value="">{t('welcome_message')}</option>
                        {WELCOME_TEMPLATES.map(tpl => (
                          <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* IA */}
                <div>
                  <h3 className="text-xl font-bold text-[#C9A14A] mb-4">{t('assistant_response')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[#0B2C3D] font-semibold mb-1">{t('status')}</label>
                      <select className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.isActive ? 'active' : 'inactive'} onChange={e => handleChange('isActive', e.target.value === 'active')}>
                        <option value="active">{t('active')}</option>
                        <option value="inactive">{t('inactive')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#0B2C3D] font-semibold mb-1">{t('response_time')}</label>
                      <input type="number" min={1} max={300} className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.responseTime} onChange={e => handleChange('responseTime', Number(e.target.value))} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[#0B2C3D] font-semibold mb-1">{t('assistant_response')}</label>
                      <div className="flex items-center gap-4">
                        <span className="text-[#0B2C3D]">{t('text')}</span>
                        <input type="range" min={0} max={100} value={form.responseType} onChange={e => handleChange('responseType', Number(e.target.value))} className="accent-[#C9A14A]" />
                        <span className="text-[#0B2C3D]">{t('audio')}</span>
                        <span className="ml-2 text-[#C9A14A] font-bold">{form.responseType}% {t('text')} / {100 - form.responseType}% {t('audio')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Texto */}
                <div>
                  <h3 className="text-xl font-bold text-[#C9A14A] mb-4">{t('text')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[#0B2C3D] font-semibold mb-1">{t('message_send_type')}</label>
                      <select className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.messageSendType} onChange={e => handleChange('messageSendType', e.target.value)}>
                        <option value="por_partes">{t('by_parts')}</option>
                        <option value="completo">{t('complete')}</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-4 mt-8 md:mt-0">
                      <label className="text-[#0B2C3D] font-semibold">{t('use_emojis')}</label>
                      <input type="checkbox" checked={form.useEmojis} onChange={e => handleChange('useEmojis', e.target.checked)} className="accent-[#C9A14A] w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-[#0B2C3D] font-semibold">{t('use_styles')}</label>
                      <input type="checkbox" checked={form.useStyles} onChange={e => handleChange('useStyles', e.target.checked)} className="accent-[#C9A14A] w-5 h-5" />
                    </div>
                  </div>
                </div>
                {/* Audio */}
                <div>
                  <h3 className="text-xl font-bold text-[#C9A14A] mb-4">{t('audio')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[#0B2C3D] font-semibold mb-1">{t('audio_voice')}</label>
                      <select className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.audioVoice} onChange={e => handleChange('audioVoice', e.target.value)}>
                        <option value="">{t('audio_voice')}</option>
                        <option value="voz1">Voz 1</option>
                        <option value="voz2">Voz 2</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#0B2C3D] font-semibold mb-1">{t('audio_count')}</label>
                      <input type="number" min={0} max={10} className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.audioCount} onChange={e => handleChange('audioCount', Number(e.target.value))} />
                    </div>
                    <div className="flex items-center gap-4 mt-8 md:mt-0">
                      <label className="text-[#0B2C3D] font-semibold">{t('reply_audio_with_audio')}</label>
                      <input type="checkbox" checked={form.replyAudioWithAudio} onChange={e => handleChange('replyAudioWithAudio', e.target.checked)} className="accent-[#C9A14A] w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-[#C9A14A] to-[#A8842C] hover:from-[#A8842C] hover:to-[#C9A14A] text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-lg"
                  >
                    {t('save_assistant')}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'integrations' && (
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">{t('whatsapp_number')}</label>
                    <input className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.whatsappNumber} onChange={e => handleChange('whatsappNumber', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">{t('whatsapp_business_id')}</label>
                    <input className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.whatsappBusinessId} onChange={e => handleChange('whatsappBusinessId', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">{t('meta_app_id')}</label>
                    <input className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.metaAppId} onChange={e => handleChange('metaAppId', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">{t('meta_token')}</label>
                    <input className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.metaToken} onChange={e => handleChange('metaToken', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#0B2C3D] font-semibold mb-1">{t('webhook_config')}</label>
                    <input className="w-full rounded-lg p-2 mb-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.webhookUrl} onChange={e => handleChange('webhookUrl', e.target.value)} placeholder={t('webhook_url')} />
                    <input className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]" value={form.webhookToken} onChange={e => handleChange('webhookToken', e.target.value)} placeholder={t('webhook_token')} />
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-[#C9A14A] to-[#A8842C] hover:from-[#A8842C] hover:to-[#C9A14A] text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-lg"
                  >
                    {t('save_assistant')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 