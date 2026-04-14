import React, { useState } from 'react';
import AppLayout from './components/AppLayout';
import { Download, Filter, Search } from 'lucide-react';

const initialData = [
  { name: 'Loading...', count: 0, topGenres: ['Loading...'] }
];

export default function TalentInsights() {
  const [activeTab, setActiveTab] = useState<'cast' | 'directors'>('cast');
  const [castData, setCastData] = useState<any[]>(initialData);
  const [directorData, setDirectorData] = useState<any[]>(initialData);

  React.useEffect(() => {
    fetch('/api/analytics/talent')
      .then(res => res.json())
      .then(resData => {
        if (resData.cast) setCastData(resData.cast);
        if (resData.directors) setDirectorData(resData.directors);
      })
      .catch(err => console.error(err));
  }, []);

  const data = activeTab === 'cast' ? castData : directorData;

  return (
    <AppLayout breadcrumbs={['Analytics', 'Talent Insights']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Talent Insights</h2>
          <p className="text-on-surface-variant mt-1">Director and cast member analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <button onClick={() => window.print()} className="bg-primary-container hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/20 w-fit">
            <button 
              onClick={() => setActiveTab('cast')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${activeTab === 'cast' ? 'bg-surface-dim text-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Top Cast
            </button>
            <button 
              onClick={() => setActiveTab('directors')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${activeTab === 'directors' ? 'bg-surface-dim text-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Top Directors
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              className="bg-surface-container-low border border-outline-variant/20 rounded-lg py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none w-full md:w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant w-16">Rank</th>
                <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Name</th>
                <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant text-right">Total Titles</th>
                <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Top Genres</th>
              </tr>
            </thead>
            <tbody>
              {data.map((person, i) => (
                <tr key={person.name} className="border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-low/30 transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-sm font-bold text-on-surface-variant">#{i + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface">{person.name}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary-container text-right">{person.count}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {person.topGenres.map(genre => (
                        <span key={genre} className="bg-surface-container-low text-on-surface-variant border border-outline-variant/20 text-[0.6rem] font-bold px-2 py-1 rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
