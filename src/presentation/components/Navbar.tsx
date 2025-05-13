'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Menu } from '@headlessui/react';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useCallback } from 'react';

const LANGUAGES = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
];

export default function Navbar() {
  // Hooks de React SIEMPRE al inicio y en el mismo orden
  // const { t, i18n } = useTranslation();
  // const { user, logout } = useAuth();

  // // Handlers con useCallback después de los hooks
  // const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
  //   i18n.changeLanguage(e.target.value);
  // }, [i18n]);

  // // const handleLogout = useCallback(() => {
  // //   logout();
  // // }, [logout]);

  // return (
  //   <nav className="w-full bg-[var(--fa-bg)] border-b border-[var(--fa-light)] px-4 py-2 flex items-center justify-between shadow z-50">
  //     <div className="flex items-center gap-3">
  //       <Image src="/assets/logos/logo.png" alt="FunnelAd" width={32} height={32} />
  //       <span className="text-xl font-bold text-[var(--fa-white)] tracking-wide">FunnelAd</span>
  //     </div>
  //     <div className="flex items-center gap-4">
  //       <div className="flex items-center gap-1">
  //         <span className="text-[var(--fa-white)] font-semibold mr-1">{t('language')}:</span>
  //         <select
  //           value={i18n.language}
  //           onChange={handleLanguageChange}
  //           className="rounded px-2 py-1 bg-[var(--fa-bg)] text-[var(--fa-white)] border border-[var(--fa-white)] focus:outline-none focus:ring-2 focus:ring-[var(--fa-white)]"
  //         >
  //           {LANGUAGES.map(lang => (
  //             <option key={lang.code} value={lang.code} className="text-[var(--fa-bg)]">
  //               {lang.name}
  //             </option>
  //           ))}
  //         </select>
  //       </div>
  //       <Menu as="div" className="relative inline-block text-left">
  //         <Menu.Button className="flex items-center gap-1 focus:outline-none">
  //           <UserCircleIcon className="h-8 w-8 text-[var(--fa-white)]" />
  //           <ChevronDownIcon className="h-5 w-5 text-[var(--fa-white)]" />
  //         </Menu.Button>
  //         <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-[var(--fa-white)] border border-[var(--fa-light)] divide-y divide-[var(--fa-light)] rounded-md shadow-lg focus:outline-none z-50">
  //           <div className="px-4 py-3">
  //             <p className="text-sm text-[var(--fa-bg)] font-semibold">
  //               {user?.name || t('user')}
  //             </p>
  //             <p className="text-xs text-[var(--fa-gray)] truncate">
  //               {user?.email || 'usuario@email.com'}
  //             </p>
  //           </div>
  //           <div className="py-1">
  //             <Menu.Item>
  //               {({ active }) => (
  //                 <a
  //                   href="/profile"
  //                   className={`block px-4 py-2 text-sm rounded ${
  //                     active ? 'bg-[var(--fa-light)] text-[var(--fa-bg)]' : 'text-[var(--fa-bg)]'
  //                   }`}
  //                 >
  //                   {t('profile')}
  //                 </a>
  //               )}
  //             </Menu.Item>
  //             <Menu.Item>
  //               {({ active }) => (
  //                 <a
  //                   href="/settings"
  //                   className={`block px-4 py-2 text-sm rounded ${
  //                     active ? 'bg-[var(--fa-light)] text-[var(--fa-bg)]' : 'text-[var(--fa-bg)]'
  //                   }`}
  //                 >
  //                   {t('settings')}
  //                 </a>
  //               )}
  //             </Menu.Item>
  //           </div>
  //           <div className="py-1">
  //             <Menu.Item>
  //               {({ active }) => (
  //                 <button
  //                   onClick={handleLogout}
  //                   className={`block w-full text-left px-4 py-2 text-sm rounded ${
  //                     active ? 'bg-red-100 text-red-700' : 'text-[var(--fa-bg)]'
  //                   }`}
  //                 >
  //                   {t('logout')}
  //                 </button>
  //               )}
  //             </Menu.Item>
  //           </div>
  //         </Menu.Items>
  //       </Menu>
  //     </div>
  //   </nav>
  // );
}