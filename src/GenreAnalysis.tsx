import React, { useState } from 'react';
import AppLayout from './components/AppLayout';
import { Download, Filter, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const mockGenreData = [ // Backup fallback
  { name: 'Loading...', count: 0 }
];

export default function GenreAnalysis() {
  const [chartType, setChartType] = useState('bar');
  const [genreData, setGenreData] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/analytics/genres')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGenreData(data.map((d: any) => ({
            name: d.genre_name,
            count: d.title_count
          })));
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Use genre data or empty fallback to prevent chart crash
  const displayData = genreData.length > 0 ? genreData : mockGenreData;

  return (
    <AppLayout breadcrumbs={['Analytics', 'Genre Analysis']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Genre Analysis</h2>
          <p className="text-on-surface-variant mt-1">Distribution and trends across content categories.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <button onClick={() => window.print()} className="bg-primary-container hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Chart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-headline font-bold text-on-surface">Genre Distribution</h3>
              <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/20">
                <button 
                  onClick={() => setChartType('bar')}
                  className={`p-1.5 rounded-md transition-colors ${chartType === 'bar' ? 'bg-surface-dim text-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setChartType('pie')}
                  className={`p-1.5 rounded-md transition-colors ${chartType === 'pie' ? 'bg-surface-dim text-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <PieChartIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1c1b1b', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#ffb4aa' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {displayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index < 3 ? '#ffb4aa' : '#4a4a4a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/10">
            <h3 className="text-lg font-headline font-bold text-on-surface">Genre Ranking</h3>
            <p className="text-sm text-on-surface-variant mt-1">Top 10 by volume</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-3 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Rank</th>
                  <th className="px-6 py-3 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Genre</th>
                  <th className="px-6 py-3 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant text-right">Titles</th>
                </tr>
              </thead>
              <tbody>
                {genreData.map((genre, i) => (
                  <tr key={genre.name} className="border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-3 text-sm font-bold text-on-surface-variant">#{i + 1}</td>
                    <td className="px-6 py-3 text-sm font-medium text-on-surface">{genre.name}</td>
                    <td className="px-6 py-3 text-sm text-on-surface-variant text-right">{genre.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
