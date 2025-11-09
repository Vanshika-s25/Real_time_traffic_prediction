import { useState, useEffect } from 'react';
import { Search, Plus, LogOut, MapPin, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';
import { predictTraffic, calculateDistance, generateAlternateRoute } from '../lib/traffic';
import { Map } from './Map';
import { RouteCard } from './RouteCard';
import { TrafficMeter } from './TrafficMeter';
import { Analytics } from './Analytics';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'saved'>('home');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateMockRoutes = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hourOfDay = now.getHours();
    const distance = calculateDistance(40.7128, -74.006, 40.758, -73.9855);

    const primaryRoute = {
      id: '1',
      label: 'Route 1 (Primary)',
      startLocation,
      endLocation,
      startLat: 40.7128,
      startLng: -74.006,
      endLat: 40.758,
      endLng: -73.9855,
      distance,
      ...predictTraffic(dayOfWeek, hourOfDay, distance),
    };

    const alternateRoute = {
      id: '2',
      label: 'Route 2 (Alternative)',
      startLocation,
      endLocation,
      startLat: 40.7128,
      startLng: -74.005,
      endLat: 40.758,
      endLng: -73.984,
      distance: distance + 0.5,
      ...predictTraffic(dayOfWeek, hourOfDay + (Math.random() > 0.5 ? 1 : -1), distance + 0.5),
    };

    return [primaryRoute, alternateRoute];
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (startLocation.trim() && endLocation.trim()) {
      setLoading(true);
      setTimeout(() => {
        const newRoutes = generateMockRoutes();
        setRoutes(newRoutes);
        setSelectedRoute(newRoutes[0]);
        setLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (selectedRoute && routes.length > 0) {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const hourOfDay = now.getHours();
        const updatedRoutes = routes.map((route) => ({
          ...route,
          ...predictTraffic(dayOfWeek, hourOfDay, route.distance),
        }));
        setRoutes(updatedRoutes);
        setSelectedRoute(updatedRoutes[0]);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [selectedRoute, routes]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Traffic Flow
            </h1>
            <p className="text-slate-400 text-sm mt-1">Real-time route optimization & prediction</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-slate-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-400" />
                Route Planner
              </h2>

              <form onSubmit={handleSearch} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    placeholder="Start location..."
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <input
                    type="text"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    placeholder="End location..."
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                      Finding Routes...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Find Routes
                    </>
                  )}
                </button>
              </form>

              {routes.length > 0 && (
                <div className="pt-4 border-t border-slate-700">
                  <div className="h-80 rounded-lg overflow-hidden">
                    <Map
                      startLat={selectedRoute?.startLat}
                      startLng={selectedRoute?.startLng}
                      endLat={selectedRoute?.endLat}
                      endLng={selectedRoute?.endLng}
                      primaryColor={selectedRoute?.color}
                      alternateColor={routes[1]?.color}
                      showAlternate={routes.length > 1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-lg p-6">
            {selectedRoute ? (
              <TrafficMeter
                congestionLevel={selectedRoute.congestionLevel}
                status={selectedRoute.status}
                color={selectedRoute.color}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p className="text-sm">Search for routes to see traffic data</p>
              </div>
            )}
          </div>
        </div>

        {routes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {routes.map((route, index) => (
              <RouteCard
                key={route.id}
                label={route.label}
                startLocation={route.startLocation}
                endLocation={route.endLocation}
                distance={route.distance}
                estimatedTime={route.estimatedTime}
                congestionLevel={route.congestionLevel}
                status={route.status}
                color={route.color}
                isOptimal={index === 0}
                isAlternate={index > 0}
                onClick={() => setSelectedRoute(route)}
              />
            ))}
          </div>
        )}

        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-3 px-4 font-medium transition-colors ${
              activeTab === 'home'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-4 font-medium transition-colors ${
              activeTab === 'saved'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Saved Routes
          </button>
        </div>

        {activeTab === 'analytics' && (
          <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-lg p-6">
            <Analytics />
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No saved routes yet</p>
                <p className="text-slate-500 text-sm mt-1">Search and save your favorite routes</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
