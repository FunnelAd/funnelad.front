'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import TriggerModal from '@/presentation/components/TriggerModal';
import type {  Trigger , CreateTriggerData} from '../../core/types/trigger';
import { triggerService } from '@/core/services/triggerService';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';


export default function TriggersPage() {
  const { t } = useTranslation();
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | undefined>();

  useEffect(() => {
    loadTriggers();
  }, []);
  

  const loadTriggers  = async ()  =>  {
    try {
      const data = await triggerService.getTriggers();
      setTriggers(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };



  

  const handleCreateTrigger = () => {
    setEditingTrigger(undefined);
    setIsCreateModalOpen(true);
  };

  const handleEditTrigger = (trigger: Trigger) => {
    setEditingTrigger(trigger);
    setIsCreateModalOpen(true);
  };

  const handleSaveTrigger = async (formData: CreateTriggerData) => {
    try {
      if (editingTrigger) {
        await triggerService.updateTrigger(editingTrigger.id, formData);
      } else {
        await triggerService.createTrigger(formData);
      }
      await loadTriggers();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDeleteTrigger = async (id: string) => {
    if (window.confirm(t('confirm_delete_trigger'))) {
      try {
        await triggerService.deleteTrigger(id);
        setTriggers(triggers.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting trigger:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'welcome':
        return t('welcome_message');
      case 'farewell':
        return t('farewell_message');
      case 'custom':
        return t('custom_message');
      default:
        return type;
    }
  };

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{t('Triggers')}</h1>
          {triggers.length > 0 ? <button 
            onClick={handleCreateTrigger}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#C9A14A] to-[#A8842C] hover:from-[#A8842C] hover:to-[#C9A14A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A14A]"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('create_trigger')}
          </button> : null}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A14A]"></div>
          </div>
        ) : triggers.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('No triggers found')}</h3>
        <p className="mt-1 text-sm text-gray-500">
              {t('Create your first trigger')}
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateTrigger}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#C9A14A] to-[#A8842C] hover:from-[#A8842C] hover:to-[#C9A14A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A14A]"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                {t('Create trigger')}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('name')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('type')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('created_at')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('updated_at')}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t('actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {triggers.map((trigger) => (
                  <tr key={trigger.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{trigger.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{trigger.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getTypeLabel(trigger.type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trigger.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trigger.isActive ? t('active') : t('inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(trigger.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(trigger.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditTrigger(trigger)}
                        className="text-[#C9A14A] hover:text-[#A8842C] mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrigger(trigger.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>
        )}

        <TriggerModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTrigger(undefined);
          }}
          onSave={handleSaveTrigger}
          trigger={editingTrigger}
          isEditing={!!editingTrigger}
        />
      </div>
  );
} 