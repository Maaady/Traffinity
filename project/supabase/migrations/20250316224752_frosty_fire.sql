/*
  # Initial Schema Setup for Traffinity

  1. New Tables
    - servers: Stores server information
    - server_metrics: Stores server health metrics
    - load_balancer_stats: Stores load balancer statistics
    - security_alerts: Stores security-related events

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Servers table
CREATE TABLE IF NOT EXISTS servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host text NOT NULL,
  port integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access"
  ON servers
  FOR SELECT
  TO authenticated
  USING (true);

-- Server metrics table
CREATE TABLE IF NOT EXISTS server_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid REFERENCES servers(id),
  cpu numeric NOT NULL,
  memory numeric NOT NULL,
  latency numeric NOT NULL,
  requests integer NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE server_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access"
  ON server_metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Load balancer stats table
CREATE TABLE IF NOT EXISTS load_balancer_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_requests bigint DEFAULT 0,
  active_connections integer DEFAULT 0,
  requests_per_second numeric DEFAULT 0,
  average_latency numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE load_balancer_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access"
  ON load_balancer_stats
  FOR SELECT
  TO authenticated
  USING (true);

-- Security alerts table
CREATE TABLE IF NOT EXISTS security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  severity text NOT NULL,
  details text,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access"
  ON security_alerts
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_servers_updated_at
  BEFORE UPDATE ON servers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_load_balancer_stats_updated_at
  BEFORE UPDATE ON load_balancer_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();