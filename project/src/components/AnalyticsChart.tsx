import React, { useEffect, useRef } from 'react';
import { Link as Line } from 'lucide-react';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface AnalyticsChartProps {
  data: DataPoint[];
  label: string;
  color: string;
}

export function AnalyticsChart({ data, label, color }: AnalyticsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min/max values
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - (((point.value - min) / (max - min)) * (height - padding * 2) + padding);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - (((point.value - min) / (max - min)) * (height - padding * 2) + padding);
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

  }, [data, color]);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Line className="text-gray-400" size={20} />
        <h3 className="text-white font-medium">{label}</h3>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full h-40"
      />
    </div>
  );
}