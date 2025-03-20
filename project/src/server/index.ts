import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { LoadBalancer } from './loadBalancer';
import { Server } from './types';
import winston from 'winston';

const app = express();
const port = 3000;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Initialize load balancer
const loadBalancer = new LoadBalancer();

// Add some mock servers
const mockServers: Server[] = [
  {
    id: 'server1',
    host: 'localhost',
    port: 8001,
    health: { cpu: 30, memory: 40, latency: 100, requests: 0, timestamp: Date.now() }
  },
  {
    id: 'server2',
    host: 'localhost',
    port: 8002,
    health: { cpu: 40, memory: 50, latency: 120, requests: 0, timestamp: Date.now() }
  }
];

mockServers.forEach(server => loadBalancer.addServer(server));

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true // Enable this to trust the IP from proxy
});

app.use(limiter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error:', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Routes
app.get('/health', (req, res) => {
  const stats = loadBalancer.getStats();
  res.json(stats.serverMetrics);
});

app.get('/stats', (req, res) => {
  const stats = loadBalancer.getStats();
  res.json(stats);
});

app.get('/servers', (req, res) => {
  const servers = loadBalancer.getServers();
  res.json(servers);
});

app.post('/servers', (req, res) => {
  try {
    const server: Server = req.body;
    loadBalancer.addServer(server);
    logger.info('Server added:', { serverId: server.id });
    res.status(201).json({ message: 'Server added successfully' });
  } catch (error) {
    logger.error('Error adding server:', error);
    res.status(400).json({ error: 'Invalid server configuration' });
  }
});

app.delete('/servers/:id', (req, res) => {
  try {
    const { id } = req.params;
    loadBalancer.removeServer(id);
    logger.info('Server removed:', { serverId: id });
    res.json({ message: 'Server removed successfully' });
  } catch (error) {
    logger.error('Error removing server:', error);
    res.status(404).json({ error: 'Server not found' });
  }
});

app.post('/route', (req, res) => {
  const server = loadBalancer.getNextServer();
  if (!server) {
    return res.status(503).json({ error: 'No servers available' });
  }

  // Update mock metrics for demonstration
  const mockMetrics = {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    latency: Math.random() * 200,
    requests: 1,
    timestamp: Date.now()
  };
  loadBalancer.updateHealth(server.id, mockMetrics);

  res.json({
    server: `${server.host}:${server.port}`,
    metrics: mockMetrics
  });
});

app.post('/security/detect', (req, res) => {
  const threatDetected = loadBalancer.checkSecurity(req.body);
  res.json({ threatDetected });
});

// Start server
app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});