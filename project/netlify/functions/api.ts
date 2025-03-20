import { Handler } from '@netlify/functions';
import { store } from './store';
import { Server, HealthMetrics } from '../../src/server/types';

export const handler: Handler = async (event) => {
  const path = event.path.replace('/.netlify/functions/api/', '');

  try {
    switch (path) {
      case 'health': {
        return {
          statusCode: 200,
          body: JSON.stringify(store.getMetrics()),
        };
      }

      case 'stats': {
        return {
          statusCode: 200,
          body: JSON.stringify(store.getStats()),
        };
      }

      case 'servers': {
        if (event.httpMethod === 'GET') {
          return {
            statusCode: 200,
            body: JSON.stringify(store.getServers()),
          };
        }

        if (event.httpMethod === 'POST') {
          const server = JSON.parse(event.body!) as Server;
          const newServer = store.addServer({
            ...server,
            id: `server-${Date.now()}`,
            health: {
              cpu: 0,
              memory: 0,
              latency: 0,
              requests: 0,
              timestamp: Date.now()
            }
          });

          // Add initial metrics
          store.updateMetrics(newServer.id, newServer.health);

          return {
            statusCode: 201,
            body: JSON.stringify(newServer),
          };
        }

        if (event.httpMethod === 'DELETE') {
          const id = event.path.split('/').pop();
          if (id) {
            store.removeServer(id);
            return {
              statusCode: 200,
              body: JSON.stringify({ message: 'Server removed' }),
            };
          }
        }

        break;
      }

      case 'security/detect': {
        const requestData = JSON.parse(event.body!);
        const threatDetected = requestData.requestsPerSecond > 1000;

        if (threatDetected) {
          store.addAlert({
            type: 'suspicious_traffic',
            severity: 'medium',
            timestamp: Date.now(),
            details: 'High request rate detected'
          });
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ threatDetected }),
        };
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};