import React from 'react';
import AppLayout from './components/AppLayout';
import { Download, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const initialData = [
  { name: 'Loading...', value: 100 }
];

const COLORS = ['#ffb4aa', '#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#00C49F', '#4a4a4a'];

export default function LanguageAnalysis() {
  const [data, setData] = React.useState<any[]>(initialData);
  const [total, setTotal] = React.useState<number>(8801);

  React.useEffect(() => {
    fetch('/api/analytics/languages')
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.languageData) {
          setData(resData.languageData);
          setTotal(resData.total);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <AppLayout breadcrumbs={['Analytics', 'Language Analysis']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Language Analysis</h2>
          <p className="text-on-surface-variant mt-1">Original language and dubbing distribution.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <button onClick={() => window.print()} className="bg-primary-container hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
          <h3 className="text-lg font-headline font-bold text-on-surface mb-6">Original Language Distribution</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1b1b', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/10">
            <h3 className="text-lg font-headline font-bold text-on-surface">Language Ranking</h3>
            <p className="text-sm text-on-surface-variant mt-1">Top languages by volume</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-3 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Language</th>
                  <th className="px-6 py-3 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant text-right">Titles</th>
                  <th className="px-6 py-3 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant text-right">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((lang, i) => (
                  <tr key={lang.name} className="border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-on-surface flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                      {lang.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface-variant text-right">{lang.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant text-right">
                      {((lang.value / total) * 100).toFixed(1)}%
                    </td>
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
