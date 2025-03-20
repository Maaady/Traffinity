import React from 'react';
import { 
  Server, 
  Shield, 
  Globe2, 
  Zap, 
  BarChart3, 
  Cloud,
  Github,
  Terminal,
  Database,
  Activity,
  Lock,
  Scale
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';

function App() {
  const [showDashboard, setShowDashboard] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {showDashboard ? (
        <Dashboard />
      ) : (
        <>
          {/* Hero Section */}
          <header className="container mx-auto px-6 py-16">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                Traffinity
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
                AI-Driven Smart Load Balancer powered by Reinforcement Learning
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDashboard(true)}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
                >
                  Open Dashboard
                </button>
                <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition flex items-center gap-2">
                  <Github size={20} />
                  GitHub
                </button>
              </div>
            </div>
          </header>

          {/* Features Grid */}
          <section className="container mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Server className="text-blue-400" />}
                title="AI-Based Traffic Routing"
                description="Dynamic request allocation using Reinforcement Learning models based on traffic patterns and server health."
              />
              <FeatureCard
                icon={<Activity className="text-green-400" />}
                title="Real-Time Monitoring"
                description="Integrated with Prometheus/Grafana for comprehensive system health tracking and analytics."
              />
              <FeatureCard
                icon={<Shield className="text-red-400" />}
                title="DDoS Protection"
                description="ML-powered anomaly detection to identify and mitigate potential threats."
              />
              <FeatureCard
                icon={<Globe2 className="text-purple-400" />}
                title="Geo-Aware Distribution"
                description="Intelligent routing to the nearest data center using latency-based algorithms."
              />
              <FeatureCard
                icon={<Scale className="text-yellow-400" />}
                title="Adaptive Rate Limiting"
                description="Smart throttling system ensuring fair request distribution across users."
              />
              <FeatureCard
                icon={<Cloud className="text-indigo-400" />}
                title="Multi-Cloud Support"
                description="Deploy across AWS, GCP, Azure, or private data centers with ease."
              />
            </div>
          </section>

          {/* Tech Stack */}
          <section className="bg-gray-800/50 py-16">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Tech Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <TechItem icon={<Terminal />} text="Golang/Rust" />
                <TechItem icon={<BarChart3 />} text="TensorFlow/PyTorch" />
                <TechItem icon={<Database />} text="PostgreSQL & Redis" />
                <TechItem icon={<Lock />} text="JWT Authentication" />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 py-8">
            <div className="container mx-auto px-6 text-center text-gray-400">
              <p>© 2025 Traffinity Team. All rights reserved.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition">
      <div className="w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function TechItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-800/30 p-4 rounded-lg">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default App;