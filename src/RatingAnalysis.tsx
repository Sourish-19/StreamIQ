import React from 'react';
import AppLayout from './components/AppLayout';
import { Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const initialData = [
  { rating: 'Loading...', movies: 0, shows: 0 }
];

export default function RatingAnalysis() {
  const [data, setData] = React.useState<any[]>(initialData);

  React.useEffect(() => {
    fetch('/api/analytics/ratings')
      .then(res => res.json())
      .then(resData => {
        if (Array.isArray(resData)) setData(resData);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <AppLayout breadcrumbs={['Analytics', 'Rating Analysis']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Rating Analysis</h2>
          <p className="text-on-surface-variant mt-1">Age group and content rating breakdowns.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <button onClick={() => window.print()} className="bg-primary-container hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10 mb-8">
        <h3 className="text-lg font-headline font-bold text-on-surface mb-6">Rating Distribution by Content Type</h3>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="rating" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: '#1c1b1b', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="movies" name="Movies" stackId="a" fill="#ffb4aa" radius={[0, 0, 4, 4]} />
              <Bar dataKey="shows" name="TV Shows" stackId="a" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
