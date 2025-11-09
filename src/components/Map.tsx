import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface MapProps {
  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;
  primaryColor?: string;
  alternateColor?: string;
  showAlternate?: boolean;
}

export function Map({
  startLat = 40.7128,
  startLng = -74.006,
  endLat = 40.758,
  endLng = -73.9855,
  primaryColor = '#3b82f6',
  alternateColor = '#8b5cf6',
  showAlternate = false,
}: MapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const gridSpacing = 30;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const startX = width * 0.2;
    const startY = height * 0.3;
    const endX = width * 0.8;
    const endY = height * 0.7;

    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    const controlX = (startX + endX) / 2;
    const controlY = (startY + endY) / 2 - 100;
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke();

    if (showAlternate) {
      ctx.strokeStyle = alternateColor;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      const altControlY = (startY + endY) / 2 + 100;
      ctx.quadraticCurveTo(controlX, altControlY, endX, endY);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(startX, startY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(endX, endY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Start', startX - 20, startY - 15);
    ctx.fillText('End', endX - 15, endY - 15);
  }, [startLat, startLng, endLat, endLng, primaryColor, alternateColor, showAlternate]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-slate-700">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute top-3 right-3 flex gap-2">
        <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <Navigation className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
