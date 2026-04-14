import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { 
  BarChart2, Radio, Users, Map, DollarSign, 
  HelpCircle, LogOut, Search, Bell, Settings, 
  Film, Tv, Globe, LayoutGrid, Filter, Calendar,
  MoreHorizontal, Play
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({ movies: 0, shows: 0, total: 0, countries: 182, genres: 42 });
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [topGenres, setTopGenres] = useState<any[]>([]);
  const [recentTitles, setRecentTitles] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Growth
    fetch('/api/analytics/growth')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const grouped = data.reduce((acc: any, curr: any) => {
            const dateKey = `${curr.year}-${curr.month.toString().padStart(2, '0')}`;
            if (!acc[dateKey]) {
              acc[dateKey] = { name: dateKey, movies: 0, tv: 0 };
            }
            if (curr.content_type === 'Movie') acc[dateKey].movies += curr.titles_added;
            if (curr.content_type === 'TV Show') acc[dateKey].tv += curr.titles_added;
            return acc;
          }, {});
          
          const formatted = Object.values(grouped).sort((a: any, b: any) => a.name.localeCompare(b.name));
          setGrowthData(formatted.slice(-10)); // keep last 10
        }
      });

    // Fetch Overview Stats
    fetch('/api/analytics/overview')
      .then(res => res.json())
      .then(data => {
        console.log('Overview stats fetched:', data);
        setStats({
          movies: data.movies || 0,
          shows: data.shows || 0,
          total: (data.movies || 0) + (data.shows || 0),
          countries: data.countries || 182,
          genres: data.genres || 42
        });
      })
      .catch(err => {
        console.error('Failed to fetch overview stats:', err);
      });

    // Fetch Genres
    fetch('/api/analytics/genres')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTopGenres(data.slice(0, 5));
      });

    // Fetch Content Types
    fetch('/api/content?limit=4')
      .then(res => res.json())
      .then(data => {
        setRecentTitles(data.titles || []);
      });
  }, []);
  return (
    <AppLayout breadcrumbs={['Overview']}>
      <div className="space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Global Content Overview</h2>
                <p className="text-on-surface-variant mt-1">Real-time distribution across {stats.countries} territories.</p>
              </div>

            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-surface-container-high rounded-xl p-6 border-l-2 border-primary-container relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <Film className="w-5 h-5 text-primary-container" />
                  <span className="bg-tertiary/10 text-tertiary text-[0.6rem] font-bold px-2 py-1 rounded">+12.4%</span>
                </div>
                <p className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Total Movies</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface">{stats.movies.toLocaleString()}</h3>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-high rounded-xl p-6 border-l-2 border-tertiary relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <Tv className="w-5 h-5 text-tertiary" />
                  <span className="bg-tertiary/10 text-tertiary text-[0.6rem] font-bold px-2 py-1 rounded">+5.2%</span>
                </div>
                <p className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Total TV Shows</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface">{stats.shows.toLocaleString()}</h3>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container-high rounded-xl p-6 border-l-2 border-primary-container relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <Globe className="w-5 h-5 text-primary-container" />
                  <span className="bg-surface-container-low text-on-surface-variant border border-outline-variant/20 text-[0.6rem] font-bold px-2 py-1 rounded">Global</span>
                </div>
                <p className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Countries</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface">{stats.countries}</h3>
              </div>

              {/* Card 4 */}
              <div className="bg-surface-container-high rounded-xl p-6 border-l-2 border-tertiary relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <LayoutGrid className="w-5 h-5 text-tertiary" />
                  <span className="bg-surface-container-low text-on-surface-variant border border-outline-variant/20 text-[0.6rem] font-bold px-2 py-1 rounded">Active</span>
                </div>
                <p className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Genres</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface">{stats.genres}</h3>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bar Chart */}
              <div className="bg-surface-container-high rounded-xl p-6 lg:col-span-2">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-lg font-headline font-bold text-on-surface">Content Growth Dynamics</h3>
                    <p className="text-sm text-on-surface-variant">Daily volume of library additions</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div>
                      <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Movies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-tertiary"></div>
                      <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">TV Shows</span>
                    </div>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={growthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#5e3f3b" strokeOpacity={0.15} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#e9bcb6', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#e9bcb6', fontSize: 10 }}
                      />
                      <Tooltip 
                        cursor={{ fill: '#353534', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: '#1c1b1b', border: 'none', borderRadius: '8px', color: '#e5e2e1' }}
                        itemStyle={{ color: '#e5e2e1' }}
                      />
                        <Bar dataKey="movies" stackId="a" fill="#e50914" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="tv" stackId="a" fill="#4cd6ff" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
              </div>

              {/* Top Genres */}
              <div className="bg-surface-container-high rounded-xl p-6 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-headline font-bold text-on-surface">Top Genres</h3>
                  <p className="text-sm text-on-surface-variant">Performance by categorization</p>
                </div>
                
                <div className="flex-1 flex flex-col justify-between gap-4">
                  {topGenres.map((genre, i) => {
                    const colors = ['bg-primary-container', 'bg-tertiary', 'bg-secondary', 'bg-primary-container', 'bg-tertiary'];
                    const shadow = i === 0 || i === 3 ? 'shadow-[0_0_8px_rgba(229,9,20,0.5)]' : i === 1 || i === 4 ? 'shadow-[0_0_8px_rgba(76,214,255,0.5)]' : '';
                    const widthPercent = topGenres[0] ? (genre.title_count / topGenres[0].title_count) * 100 : 0;
                    
                    return (
                      <div key={genre._id || genre.genre_name}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                          <span className="text-on-surface">{genre.genre_name}</span>
                          <span className="text-on-surface-variant">{genre.title_count?.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div className={`h-full ${colors[i % colors.length]} rounded-full ${shadow}`} style={{ width: `${widthPercent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link to="/analytics/genres" className="mt-6 w-full py-3 text-center block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface transition-colors">
                  View All Genres
                </Link>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-surface-container-high rounded-xl overflow-hidden">
              <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface">Recently Added Titles</h3>
                  <p className="text-sm text-on-surface-variant">Last 24 hours of ingestions</p>
                </div>
                <Link to="/content" className="text-[0.6875rem] uppercase tracking-widest font-bold text-tertiary hover:text-tertiary-fixed transition-colors">
                  Full Audit Log
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Title Name</th>
                      <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Type</th>
                      <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Region</th>
                      <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Release Year</th>
                      <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Status</th>
                      <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTitles.map((title, i) => (
                      <tr key={title.title || i} className={i % 2 === 0 ? 'bg-surface-container-low/50' : 'bg-transparent hover:bg-surface-container-low/30 transition-colors'}>
                        <td className="px-6 py-4 font-medium text-on-surface flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                            <Play className="w-3 h-3 text-on-surface-variant" />
                          </div>
                          {title.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{title.type || 'Movie'}</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{title.countries?.[0] || 'Global'}</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{title.release_year}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-container/10 text-primary-container`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                            Live
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to="/content" title="View in Explorer" className="inline-flex items-center justify-center p-2 rounded-lg text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </Link>
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
