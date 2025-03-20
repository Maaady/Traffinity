export interface Server {
  id: string;
  host: string;
  port: number;
  health: HealthMetrics;
}

export interface HealthMetrics {
  cpu: number;
  memory: number;
  latency: number;
  requests: number;
  timestamp: number;
}

export interface LoadBalancerStats {
  totalRequests: number;
  activeConnections: number;
  requestsPerSecond: number;
  averageLatency: number;
  serverMetrics: Record<string, HealthMetrics>;
}

export interface SecurityAlert {
  type: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  details: string;
}