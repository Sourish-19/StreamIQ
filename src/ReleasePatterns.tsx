import React from 'react';
import AppLayout from './components/AppLayout';
import { Download, Filter, Calendar as CalendarIcon, PlayCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const initialData = [
  { month: 'Jan', count: 0 },
  { month: 'Feb', count: 0 },
  { month: 'Mar', count: 0 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 0 },
  { month: 'Jun', count: 0 },
  { month: 'Jul', count: 0 },
  { month: 'Aug', count: 0 },
  { month: 'Sep', count: 0 },
  { month: 'Oct', count: 0 },
  { month: 'Nov', count: 0 },
  { month: 'Dec', count: 0 },
];

export default function ReleasePatterns() {
  const [data, setData] = React.useState<any[]>(initialData);
  const [peakMonth, setPeakMonth] = React.useState<string>('Loading...');
  const [lowestMonth, setLowestMonth] = React.useState<string>('Loading...');

  React.useEffect(() => {
    fetch('/api/analytics/release-patterns')
      .then(res => res.json())
      .then(resData => {
        if (Array.isArray(resData)) {
          setData(resData);
          if (resData.length > 0) {
            const sorted = [...resData].sort((a, b) => b.count - a.count);
            setPeakMonth(sorted[0].month);
            setLowestMonth(sorted[sorted.length - 1].month);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <AppLayout breadcrumbs={['Analytics', 'Release Patterns']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Release Patterns</h2>
          <p className="text-on-surface-variant mt-1">Temporal analysis of content drops.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <button onClick={() => window.print()} className="bg-primary-container hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
          <h3 className="text-lg font-headline font-bold text-on-surface mb-6">Content Additions by Month</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1c1b1b', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#ffb4aa' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 800 ? '#ffb4aa' : '#4a4a4a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-primary-container" />
              </div>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Peak Release Month</p>
                <p className="text-2xl font-headline font-bold text-on-surface">{peakMonth}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">Historically, October sees the highest volume of new content additions, likely preparing for the holiday season.</p>
          </div>

          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-tertiary" />
              </div>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Lowest Release Month</p>
                <p className="text-2xl font-headline font-bold text-on-surface">{lowestMonth}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">February consistently shows the lowest volume of new additions across both movies and TV shows.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
