import { Gauge } from 'lucide-react';

interface TrafficMeterProps {
  congestionLevel: number;
  status: string;
  color: string;
}

export function TrafficMeter({ congestionLevel, status, color }: TrafficMeterProps) {
  const normalizedLevel = Math.min(100, Math.max(0, congestionLevel));
  const rotation = (normalizedLevel / 100) * 270 - 135;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="#1e293b"
            strokeWidth="15"
          />

          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="15"
            strokeDasharray={`${(normalizedLevel / 100) * (2 * Math.PI * 85)} ${2 * Math.PI * 85}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-135 100 100)"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />

          <g transform={`rotate(${rotation} 100 100)`}>
            <line x1="100" y1="25" x2="100" y2="50" stroke={color} strokeWidth="3" />
            <circle cx="100" cy="100" r="8" fill={color} />
          </g>

          <text
            x="100"
            y="110"
            textAnchor="middle"
            fontSize="32"
            fontWeight="bold"
            fill="white"
            className="font-mono"
          >
            {normalizedLevel}%
          </text>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <Gauge className="w-12 h-12 text-slate-700 opacity-50" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-400 mb-1">Traffic Status</p>
        <p
          className="text-lg font-semibold"
          style={{ color }}
        >
          {status}
        </p>
      </div>

      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-slate-400">Free Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-400">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-slate-400">Heavy</span>
        </div>
      </div>
    </div>
  );
}
