import React, { useState, useEffect } from 'react';
import { TraffinityAPI } from '../api/traffinity';
import { BarChart3, Server, Shield, Activity } from 'lucide-react';
import type { HealthMetrics, LoadBalancerStats } from '../server/types';
import { ServerManagement } from './ServerManagement';
import { AnalyticsChart } from './AnalyticsChart';

const api = new TraffinityAPI();

export function Dashboard() {
  const [health, setHealth] = useState<Record<string, HealthMetrics>>({});
  const [stats, setStats] = useState<LoadBalancerStats | null>(null);
  const [securityStatus, setSecurityStatus] = useState<{ threatDetected: boolean }>({ threatDetected: false });
  const [analyticsData, setAnalyticsData] = useState<{
    cpu: { timestamp: number; value: number; }[];
    memory: { timestamp: number; value: number; }[];
    latency: { timestamp: number; value: number; }[];
  }>({
    cpu: [],
    memory: [],
    latency: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthData, statsData, securityData] = await Promise.all([
          api.getHealth(),
          api.getStats(),
          api.checkSecurity()
        ]);

        setHealth(healthData);
        setStats(statsData);
        setSecurityStatus(securityData);

        // Update analytics data
        const timestamp = Date.now();
        setAnalyticsData(prev => ({
          cpu: [...prev.cpu, { timestamp, value: statsData.averageCpu || 0 }].slice(-20),
          memory: [...prev.memory, { timestamp, value: statsData.averageMemory || 0 }].slice(-20),
          latency: [...prev.latency, { timestamp, value: statsData.averageLatency }].slice(-20)
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Server className="w-6 h-6 text-blue-500" />}
            title="Active Connections"
            value={stats?.activeConnections || 0}
          />
          <StatCard
            icon={<Activity className="w-6 h-6 text-green-500" />}
            title="Requests/Sec"
            value={stats?.requestsPerSecond.toFixed(2) || '0'}
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6 text-purple-500" />}
            title="Avg Latency"
            value={`${stats?.averageLatency.toFixed(2) || 0}ms`}
          />
          <StatCard
            icon={<Shield className="w-6 h-6 text-red-500" />}
            title="Security Status"
            value={securityStatus.threatDetected ? 'Threat Detected' : 'Secure'}
            status={securityStatus.threatDetected ? 'danger' : 'success'}
          />
        </div>

        {/* Server Management */}
        <ServerManagement />

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnalyticsChart
            data={analyticsData.cpu}
            label="CPU Usage"
            color="#3B82F6"
          />
          <AnalyticsChart
            data={analyticsData.memory}
            label="Memory Usage"
            color="#10B981"
          />
          <AnalyticsChart
            data={analyticsData.latency}
            label="Latency"
            color="#8B5CF6"
          />
        </div>

        {/* Server Health */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Server Health</h2>
          <div className="grid gap-4">
            {Object.entries(health).map(([serverId, metrics]) => (
              <ServerHealthCard key={serverId} serverId={serverId} metrics={metrics} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  status = 'normal' 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string | number; 
  status?: 'normal' | 'success' | 'danger' 
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
          status === 'success' ? 'bg-green-900/50 text-green-400' :
          status === 'danger' ? 'bg-red-900/50 text-red-400' :
          'bg-gray-700 text-gray-300'
        }`}>
          {status === 'normal' ? 'Active' : status}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}

function ServerHealthCard({ serverId, metrics }: { serverId: string; metrics: HealthMetrics }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{serverId}</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${
          metrics.cpu > 80 || metrics.memory > 80 
            ? 'bg-red-900/50 text-red-400' 
            : 'bg-green-900/50 text-green-400'
        }`}>
          {metrics.cpu > 80 || metrics.memory > 80 ? 'High Load' : 'Healthy'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Metric label="CPU" value={`${metrics.cpu.toFixed(1)}%`} />
        <Metric label="Memory" value={`${metrics.memory.toFixed(1)}%`} />
        <Metric label="Latency" value={`${metrics.latency.toFixed(0)}ms`} />
        <Metric label="Requests" value={metrics.requests} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-medium text-gray-200">{value}</p>
    </div>
  );
}