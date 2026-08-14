import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const Route = createFileRoute("/analytics")({
  component: AnalyticsDashboard,
});

const mockInteractionData = [
  { name: 'Mon', interactions: 120, conversion: 12 },
  { name: 'Tue', interactions: 180, conversion: 18 },
  { name: 'Wed', interactions: 250, conversion: 28 },
  { name: 'Thu', interactions: 210, conversion: 24 },
  { name: 'Fri', interactions: 310, conversion: 35 },
  { name: 'Sat', interactions: 450, conversion: 52 },
  { name: 'Sun', interactions: 380, conversion: 40 },
];

function AnalyticsDashboard() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display font-bold gold-text mb-2">AI Concierge Analytics</h1>
      <p className="text-muted-foreground mb-8">Monitor AI interactions and sales conversions in real-time.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 border border-gold/20 rounded-xl bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Total AI Interactions</h3>
          <p className="text-4xl font-display font-bold mt-2">1,900</p>
          <p className="text-xs text-green-500 mt-1">+14% from last week</p>
        </div>
        <div className="p-6 border border-gold/20 rounded-xl bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">AI-Driven Conversions</h3>
          <p className="text-4xl font-display font-bold mt-2">209</p>
          <p className="text-xs text-green-500 mt-1">+22% from last week</p>
        </div>
        <div className="p-6 border border-gold/20 rounded-xl bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Avg. Conversion Rate</h3>
          <p className="text-4xl font-display font-bold mt-2">11%</p>
          <p className="text-xs text-green-500 mt-1">+2% from last week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 border border-gold/20 rounded-xl bg-card">
          <h3 className="font-display text-xl mb-6 text-gold">Interactions Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockInteractionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6A87C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#C6A87C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#C6A87C' }}
                  itemStyle={{ color: '#C6A87C' }}
                />
                <Area type="monotone" dataKey="interactions" stroke="#C6A87C" fillOpacity={1} fill="url(#colorInteractions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 border border-gold/20 rounded-xl bg-card">
          <h3 className="font-display text-xl mb-6 text-gold">Conversions from AI</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockInteractionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#C6A87C' }}
                  cursor={{ fill: '#222' }}
                />
                <Bar dataKey="conversion" fill="#C6A87C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
