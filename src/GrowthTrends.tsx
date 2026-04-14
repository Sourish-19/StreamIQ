import React from 'react';
import AppLayout from './components/AppLayout';
import { Download, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const growthData = [
  { year: '2015', movies: 56, shows: 26 },
  { year: '2016', movies: 253, shows: 176 },
  { year: '2017', movies: 839, shows: 349 },
  { year: '2018', movies: 1237, shows: 412 },
  { year: '2019', movies: 1424, shows: 592 },
  { year: '2020', movies: 1284, shows: 697 },
  { year: '2021', movies: 993, shows: 505 },
];

export default function GrowthTrends() {
  return (
    <AppLayout breadcrumbs={['Analytics', 'Growth Trends']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Growth Trends</h2>
          <p className="text-on-surface-variant mt-1">Content addition volume over time.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <button onClick={() => window.print()} className="bg-primary-container hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10 mb-8">
        <h3 className="text-lg font-headline font-bold text-on-surface mb-6">Content Added per Year</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMovies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb4aa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffb4aa" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorShows" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1c1b1b', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="movies" stroke="#ffb4aa" fillOpacity={1} fill="url(#colorMovies)" name="Movies" />
              <Area type="monotone" dataKey="shows" stroke="#82ca9d" fillOpacity={1} fill="url(#colorShows)" name="TV Shows" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
