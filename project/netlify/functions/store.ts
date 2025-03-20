import { Server, HealthMetrics, LoadBalancerStats, SecurityAlert } from '../../src/server/types';

class Store {
  private servers: Server[] = [];
  private metrics: Record<string, HealthMetrics> = {};
  private stats: LoadBalancerStats = {
    totalRequests: 0,
    activeConnections: 0,
    requestsPerSecond: 0,
    averageLatency: 0,
    serverMetrics: {}
  };
  private alerts: SecurityAlert[] = [];

  // Server operations
  getServers(): Server[] {
    return this.servers;
  }

  addServer(server: Server): Server {
    this.servers.push(server);
    return server;
  }

  removeServer(id: string): void {
    this.servers = this.servers.filter(s => s.id !== id);
  }

  // Metrics operations
  getMetrics(): Record<string, HealthMetrics> {
    return this.metrics;
  }

  updateMetrics(serverId: string, metrics: HealthMetrics): void {
    this.metrics[serverId] = {
      ...metrics,
      timestamp: Date.now()
    };
  }

  // Stats operations
  getStats(): LoadBalancerStats {
    return this.stats;
  }

  updateStats(stats: Partial<LoadBalancerStats>): void {
    this.stats = {
      ...this.stats,
      ...stats,
      serverMetrics: this.metrics
    };
  }

  // Security operations
  addAlert(alert: SecurityAlert): void {
    this.alerts.push(alert);
  }

  getAlerts(): SecurityAlert[] {
    return this.alerts;
  }
}

export const store = new Store();