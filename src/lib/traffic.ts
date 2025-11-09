export interface TrafficPrediction {
  congestionLevel: number;
  estimatedTime: number;
  color: string;
  status: string;
}

export interface RouteData {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  distance: number;
}

export function predictTraffic(
  dayOfWeek: number,
  hourOfDay: number,
  distance: number,
  temperature: number = 25
): TrafficPrediction {
  let baseCongesttion = 20;

  const rushHours = [7, 8, 9, 17, 18, 19];
  if (rushHours.includes(hourOfDay)) {
    baseCongesttion += 40;
  }

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  if (!isWeekend && hourOfDay >= 10 && hourOfDay <= 16) {
    baseCongesttion += 15;
  }

  if (temperature > 30) {
    baseCongesttion += 10;
  }

  const randomVariation = (Math.random() - 0.5) * 20;
  const congestionLevel = Math.max(0, Math.min(100, baseCongesttion + randomVariation));

  let baseTime = Math.max(5, (distance / 50) * 60);
  const timeMultiplier = 0.5 + (congestionLevel / 100) * 2;
  const estimatedTime = Math.round(baseTime * timeMultiplier);

  let color = '#10b981';
  let status = 'Free Flow';

  if (congestionLevel > 70) {
    color = '#ef4444';
    status = 'Heavy Traffic';
  } else if (congestionLevel > 40) {
    color = '#f59e0b';
    status = 'Moderate Traffic';
  }

  return {
    congestionLevel: Math.round(congestionLevel),
    estimatedTime,
    color,
    status,
  };
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function generateAlternateRoute(route: RouteData): RouteData {
  const offset = 0.02;
  return {
    ...route,
    startLat: route.startLat + (Math.random() - 0.5) * offset,
    startLng: route.startLng + (Math.random() - 0.5) * offset,
    endLat: route.endLat + (Math.random() - 0.5) * offset,
    endLng: route.endLng + (Math.random() - 0.5) * offset,
  };
}
