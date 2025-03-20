import { Server, HealthMetrics, LoadBalancerStats } from '../server/types';

const API_URL = import.meta.env.PROD ? '/.netlify/functions/api' : 'http://localhost:9999/.netlify/functions/api';

export class TraffinityAPI {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getHealth(): Promise<Record<string, HealthMetrics>> {
    return this.fetch('health');
  }

  async getStats(): Promise<LoadBalancerStats> {
    return this.fetch('stats');
  }

  async getServers(): Promise<Server[]> {
    return this.fetch('servers');
  }

  async addServer(server: Server): Promise<void> {
    return this.fetch('servers', {
      method: 'POST',
      body: JSON.stringify(server),
    });
  }

  async removeServer(serverId: string): Promise<void> {
    return this.fetch(`servers/${serverId}`, {
      method: 'DELETE',
    });
  }

  async routeRequest(path: string, method: string = 'GET', body?: any): Promise<any> {
    return this.fetch('route', {
      method: 'POST',
      body: JSON.stringify({ path, method, body }),
    });
  }

  async checkSecurity(): Promise<{ threatDetected: boolean }> {
    return this.fetch('security/detect', { method: 'POST' });
  }
}