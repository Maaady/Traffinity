import { Server, HealthMetrics, LoadBalancerStats } from './types';
import { HealthMonitor } from './health';
import { SecurityMonitor } from './security';

export class LoadBalancer {
  private servers: Server[] = [];
  private currentIndex = 0;
  private healthMonitor: HealthMonitor;
  private securityMonitor: SecurityMonitor;
  private stats: LoadBalancerStats;

  constructor() {
    this.healthMonitor = new HealthMonitor();
    this.securityMonitor = new SecurityMonitor();
    this.stats = {
      totalRequests: 0,
      activeConnections: 0,
      requestsPerSecond: 0,
      averageLatency: 0,
      serverMetrics: {}
    };
  }

  addServer(server: Server): void {
    this.servers.push(server);
  }

  removeServer(serverId: string): void {
    this.servers = this.servers.filter(server => server.id !== serverId);
  }

  getNextServer(): Server | null {
    if (this.servers.length === 0) return null;

    // Simple round-robin implementation
    const server = this.servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;

    return server;
  }

  updateHealth(serverId: string, metrics: HealthMetrics): void {
    this.healthMonitor.updateMetrics(serverId, metrics);
    this.updateStats();
  }

  private updateStats(): void {
    const metrics = this.healthMonitor.getAllMetrics();
    let totalLatency = 0;
    let totalRequests = 0;

    Object.values(metrics).forEach(metric => {
      totalLatency += metric.latency;
      totalRequests += metric.requests;
    });

    this.stats = {
      ...this.stats,
      totalRequests,
      averageLatency: totalLatency / Object.keys(metrics).length || 0,
      serverMetrics: metrics
    };
  }

  getStats(): LoadBalancerStats {
    return this.stats;
  }

  checkSecurity(requestData: any): boolean {
    return this.securityMonitor.detectThreats(requestData);
  }
}