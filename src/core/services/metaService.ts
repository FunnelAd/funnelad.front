
import { getAuthToken } from './authService'; // Assuming you have a service to get the auth token

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const metaService = {
  async getIntegrationStatus(businessId: string): Promise<{ connected: boolean }> {
    try {
      // const token = await getAuthToken(); // You need to implement this
      const response = await fetch(`${API_URL}/api/meta/integration/status/${businessId}`, {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Meta integration status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Meta integration status:', error);
      return { connected: false };
    }
  },

  initiateAuth(businessId: string) {
    // Redirect the user to the backend to start the OAuth flow
    window.location.href = `${API_URL}/api/meta/auth?businessId=${businessId}`;
  },

  async completeAuth(code: string, businessId: string): Promise<{ success: boolean }> {
    try {
      // const token = await getAuthToken(); // You need to implement this
      const response = await fetch(`${API_URL}/api/meta/auth/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code, businessId })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to complete Meta authentication');
      }

      return { success: true };
    } catch (error) {
      console.error('Error completing Meta authentication:', error);
      return { success: false };
    }
  }
};
