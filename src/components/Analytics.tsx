import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  hourlyData?: { hour: number; congestion: number }[];
  weeklyData?: { day: string; avgCongestion: number }[];
}

export function Analytics({ hourlyData = [], weeklyData = [] }: AnalyticsProps) {
  const defaultHourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    congestion: Math.floor(Math.random() * 80 + 10),
  }));

  const defaultWeeklyData = [
    { day: 'Mon', avgCongestion: 65 },
    { day: 'Tue', avgCongestion: 58 },
    { day: 'Wed', avgCongestion: 62 },
    { day: 'Thu', avgCongestion: 60 },
    { day: 'Fri', avgCongestion: 72 },
    { day: 'Sat', avgCongestion: 40 },
    { day: 'Sun', avgCongestion: 35 },
  ];

  const hours = hourlyData.length > 0 ? hourlyData : defaultHourlyData;
  const weekly = weeklyData.length > 0 ? weeklyData : defaultWeeklyData;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Hourly Traffic Trends</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hours}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="hour"
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(val) => `${val}:00`}
            />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(value) => [`${value}%`, 'Congestion']}
              labelFormatter={(label) => `${label}:00`}
            />
            <Bar dataKey="congestion" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold text-white">Weekly Average Congestion</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(value) => [`${value}%`, 'Avg Congestion']}
            />
            <Bar dataKey="avgCongestion" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
