import { HealthMetrics } from './types';

export class HealthMonitor {
  private metrics: Map<string, HealthMetrics> = new Map();

  updateMetrics(serverId: string, metrics: HealthMetrics): void {
    this.metrics.set(serverId, {
      ...metrics,
      timestamp: Date.now()
    });
  }

  getMetrics(serverId: string): HealthMetrics | undefined {
    return this.metrics.get(serverId);
  }

  getAllMetrics(): Record<string, HealthMetrics> {
    const allMetrics: Record<string, HealthMetrics> = {};
    this.metrics.forEach((value, key) => {
      allMetrics[key] = value;
    });
    return allMetrics;
  }

  isHealthy(serverId: string): boolean {
    const metrics = this.metrics.get(serverId);
    if (!metrics) return false;

    return (
      metrics.cpu < 80 &&
      metrics.memory < 80 &&
      metrics.latency < 1000 &&
      Date.now() - metrics.timestamp < 30000
    );
  }
}