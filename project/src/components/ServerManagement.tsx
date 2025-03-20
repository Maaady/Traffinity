import React, { useState } from 'react';
import { Plus, Trash2, RefreshCw, Server as ServerIcon } from 'lucide-react';
import { Server } from '../server/types';
import { TraffinityAPI } from '../api/traffinity';

const api = new TraffinityAPI();

export function ServerManagement() {
  const [newServer, setNewServer] = useState({
    host: '',
    port: 8080
  });
  const [servers, setServers] = useState<Server[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addServer({
        id: `server-${Date.now()}`,
        host: newServer.host,
        port: newServer.port,
        health: {
          cpu: 0,
          memory: 0,
          latency: 0,
          requests: 0,
          timestamp: Date.now()
        }
      });
      setIsAdding(false);
      setNewServer({ host: '', port: 8080 });
      // Refresh server list
      const updatedServers = await api.getServers();
      setServers(updatedServers);
    } catch (error) {
      console.error('Failed to add server:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Server Management</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition"
        >
          <Plus size={18} />
          Add Server
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddServer} className="mb-6 bg-gray-700 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Host</label>
              <input
                type="text"
                value={newServer.host}
                onChange={(e) => setNewServer({ ...newServer, host: e.target.value })}
                className="w-full bg-gray-600 text-white rounded-md px-3 py-2 border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                placeholder="hostname or IP"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Port</label>
              <input
                type="number"
                value={newServer.port}
                onChange={(e) => setNewServer({ ...newServer, port: parseInt(e.target.value) })}
                className="w-full bg-gray-600 text-white rounded-md px-3 py-2 border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                min="1"
                max="65535"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition"
            >
              Add Server
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {servers.map((server) => (
          <div
            key={server.id}
            className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <ServerIcon className="text-blue-400" />
              <div>
                <h3 className="text-white font-medium">{server.host}:{server.port}</h3>
                <p className="text-gray-400 text-sm">ID: {server.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* Implement refresh */}}
                className="p-2 hover:bg-gray-600 rounded-lg transition"
                title="Refresh server status"
              >
                <RefreshCw size={18} className="text-gray-400" />
              </button>
              <button
                onClick={() => {/* Implement remove */}}
                className="p-2 hover:bg-gray-600 rounded-lg transition"
                title="Remove server"
              >
                <Trash2 size={18} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}