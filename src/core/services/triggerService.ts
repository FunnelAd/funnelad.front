
import { Trigger, CreateTriggerData, UpdateTriggerData } from '../types/trigger';
// Simulación de datos para desarrollo
const MOCK_ASSISTANTS: Trigger[] = [
  {
    id: '1',
    name: 'Asistente de Ventas',
    content: "",
    type: "",
    description: 'Asistente especializado en ventas y atención al cliente',
    model: 'gpt-4',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    isActive: true,
    storeId: 'store1',
    storeName: 'Mi Tienda',
    createdBy: 'admin@funnelad.com',
    lastUsed: '2024-03-20T15:30:00Z',
    totalConversations: 150,
    successRate: 85,
  },
  {
    id: '2',
    name: 'Asistente de Soporte',
    content: "",
    type: "",
    description: 'Asistente para resolver dudas y problemas técnicos',
    model: 'gpt-3.5-turbo',
    createdAt: '2024-03-16T14:00:00Z',
    updatedAt: '2024-03-16T14:00:00Z',
    isActive: true,
    storeId: 'store1',
    storeName: 'Mi Tienda',
    createdBy: 'admin@funnelad.com',
    lastUsed: '2024-03-19T09:15:00Z',
    totalConversations: 75,
    successRate: 92,
  },
];

export const triggerService = {
  async getTriggers(): Promise<Trigger[]> {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ASSISTANTS);
      }, 500);
    });
  },

  async createTrigger(data: CreateTriggerData): Promise<Trigger> {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAssistant: Trigger = {
          id: Date.now().toString(),
          ...data,
          content: "",
          type: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          storeName: 'Mi Tienda', // Esto vendría del backend
          createdBy: 'admin@funnelad.com', // Esto vendría del backend
        };
        resolve(newAssistant);
      }, 500);
    });
  },

  async updateTrigger(id: string, data: UpdateTriggerData): Promise<Trigger> {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const assistant = MOCK_ASSISTANTS.find(a => a.id === id);
        if (!assistant) {
          throw new Error('Assistant not found');
        }
        const updatedAssistant = {
          ...assistant,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        resolve(updatedAssistant);
      }, 500);
    });
  },

  async deleteTrigger(id: string): Promise<void> {
    // Simulación de llamada a API
    console.log(id)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
}; 