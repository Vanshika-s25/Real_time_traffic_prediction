import { Clock, MapPin, AlertCircle } from 'lucide-react';

interface RouteCardProps {
  label: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedTime: number;
  congestionLevel: number;
  status: string;
  color: string;
  isOptimal?: boolean;
  isAlternate?: boolean;
  onClick?: () => void;
}

export function RouteCard({
  label,
  startLocation,
  endLocation,
  distance,
  estimatedTime,
  congestionLevel,
  status,
  color,
  isOptimal = false,
  isAlternate = false,
  onClick,
}: RouteCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        isOptimal
          ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/50'
          : isAlternate
            ? 'bg-gradient-to-r from-violet-900/20 to-purple-900/20 border-violet-500/50'
            : 'bg-slate-800/50 border-slate-700/50'
      } hover:border-opacity-100`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-sm">{label}</h3>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <MapPin className="w-3 h-3" />
            {startLocation} → {endLocation}
          </div>
        </div>
        {isOptimal && (
          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full font-medium">
            Optimal
          </span>
        )}
        {isAlternate && (
          <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full font-medium">
            Alternative
          </span>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Distance:</span>
          <span className="text-white font-medium">{distance.toFixed(1)} km</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">ETA:</span>
          <div className="flex items-center gap-1 text-white font-medium">
            <Clock className="w-3 h-3" />
            {estimatedTime} min
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Traffic:</span>
            <span className="text-white font-medium">{status}</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${congestionLevel}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <div className="text-xs text-slate-400 mt-1">{congestionLevel}% congestion</div>
        </div>
      </div>

      {congestionLevel > 70 && (
        <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          High traffic detected on this route
        </div>
      )}
    </div>
  );
}
