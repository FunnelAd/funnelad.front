import { Assistant, CreateAssistantData, UpdateAssistantData } from '../types/assistant';

// Simulación de datos para desarrollo
const MOCK_ASSISTANTS: Assistant[] = [
  {
    id: '1',
    name: 'Asistente de Ventas',
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

export const assistantService = {
  async getAssistants(): Promise<Assistant[]> {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ASSISTANTS);
      }, 500);
    });
  },

  async createAssistant(data: CreateAssistantData): Promise<Assistant> {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAssistant: Assistant = {
          id: Date.now().toString(),
          ...data,
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

  async updateAssistant(id: string, data: UpdateAssistantData): Promise<Assistant> {
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

  async deleteAssistant(id: string): Promise<void> {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
}; 