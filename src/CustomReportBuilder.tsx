import React, { useState } from 'react';
import AppLayout from './components/AppLayout';
import { LayoutTemplate, Save, Play, Printer, X, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AVAILABLE_MODULES = [
  { id: 'genres', name: 'Genre Analysis', endpoint: '/api/analytics/genres' },
  { id: 'regions', name: 'Regional Distribution', endpoint: '/api/analytics/regions' },
  { id: 'growth', name: 'Growth Trends', endpoint: '/api/analytics/growth' },
  { id: 'languages', name: 'Language Analysis', endpoint: '/api/analytics/languages' },
  { id: 'ratings', name: 'Rating Analysis', endpoint: '/api/analytics/ratings' },
  { id: 'releases', name: 'Release Patterns', endpoint: '/api/analytics/release-patterns' }
];

function CustomDropdown({ label, options, value, onChange, theme = 'primary' }: { label: string, options: string[], value: string, onChange: (v: string) => void, theme?: 'primary' | 'tertiary' }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const borderFocus = theme === 'primary' 
    ? 'focus:border-primary-container focus:ring-primary-container/10 hover:border-primary-container/40' 
    : 'focus:border-tertiary focus:ring-tertiary/10 hover:border-tertiary/40';
  
  const itemActive = theme === 'primary' 
    ? 'bg-primary-container/10 text-primary-container font-bold' 
    : 'bg-tertiary/10 text-tertiary font-bold';
    
  const itemHover = theme === 'primary' 
    ? 'hover:bg-primary-container/5 hover:text-white' 
    : 'hover:bg-tertiary/5 hover:text-white';

  return (
    <div className="relative">
      <label className="block text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label}</label>
      <div 
        tabIndex={0}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#1A1A1A] border-2 border-outline-variant/20 ${borderFocus} rounded-xl px-4 py-3 text-sm text-white font-medium transition-all cursor-pointer flex justify-between items-center outline-none ${isOpen ? borderFocus.split(' ')[0] : ''}`}
      >
        <span>{value}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-on-surface-variant transition-transform ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1c1b1b] border border-outline-variant/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
          {options.map(opt => (
            <div 
              key={opt}
              onClick={(e) => { e.stopPropagation(); onChange(opt); setIsOpen(false); }}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors ${value === opt ? itemActive : `text-on-surface-variant ${itemHover}`}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomReportBuilder() {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  
  const [dateRange, setDateRange] = useState('All Time');
  const [contentType, setContentType] = useState('All Content');

  const toggleModule = (id: string) => {
    setSelectedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedModules.length === 0) return;
    
    setIsGenerating(true);
    try {
      const results: any = {};
      
      const fetchPromises = selectedModules.map(async (moduleId) => {
        const mod = AVAILABLE_MODULES.find(m => m.id === moduleId);
        if (mod) {
          const res = await fetch(mod.endpoint);
          const data = await res.json();
          results[moduleId] = { name: mod.name, data };
        }
      });

      await Promise.all(fetchPromises);
      setGeneratedReport(results);
    } catch (err) {
      console.error("Error generating report", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderChart = (moduleId: string, rawData: any) => {
    if (!rawData) return <p className="text-on-surface-variant">No data available.</p>;

    // Safely extract the array data based on module type
    let data: any[] = [];
    if (moduleId === 'talent') data = rawData.cast || [];
    else if (moduleId === 'languages') data = rawData.languageData || [];
    else data = Array.isArray(rawData) ? rawData : [];

    if (data.length === 0) return <p className="text-on-surface-variant">No data available.</p>;

    switch(moduleId) {
      case 'genres':
      case 'regions':
      case 'languages': {
        const barData = data.slice(0, 10).map((d: any) => ({ 
          name: d.genre_name || d.country_name || d.name || 'Unknown', 
          count: d.title_count || d.value || 0 
        }));
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1c1b1b', borderColor: '#333' }} />
              <Bar dataKey="count" fill="#ffb4aa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      }
      
      case 'growth':
      case 'releases': {
        const lineData = data.map((d: any) => ({ 
          name: d.year ? `${d.year}-${d.month}` : d.month || 'Unknown', 
          count: d.titles_added || d.count || 0 
        }));
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1c1b1b', borderColor: '#333' }} />
              <Line type="monotone" dataKey="count" stroke="#ffb4aa" strokeWidth={3} dot={{ fill: '#ffb4aa', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }

      case 'ratings':
      case 'talent': {
        const listData = data.slice(0, 8).map((d: any) => ({
          title: d.rating || d.name || 'Unknown',
          sub: d.topGenres ? `Known for: ${d.topGenres.join(', ')}` : (d.movies !== undefined ? `${d.movies} Movies, ${d.shows} Shows` : ''),
          total: d.count || d.title_count || (d.movies + d.shows) || 0
        }));

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {listData.map((d: any, i: number) => (
                <div key={i} className="bg-surface-container flex justify-between p-4 rounded-lg border border-outline-variant/10">
                  <div>
                    <p className="font-bold text-on-surface">{d.title}</p>
                    {d.sub && <p className="text-xs text-on-surface-variant max-w-[200px] truncate">{d.sub}</p>}
                  </div>
                  <div className="font-headline font-bold text-lg text-primary-container">{d.total}</div>
                </div>
             ))}
          </div>
        );
      }
      default:
        return <div>Data loaded successfully.</div>;
    }
  };

  return (
    <AppLayout breadcrumbs={['Analytics', 'Custom Report Builder']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Custom Report Builder</h2>
          <p className="text-on-surface-variant mt-1">Build bespoke reports from multiple modules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.print()} className="bg-surface-container-low hover:bg-surface-container-highest text-on-surface text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-lg transition-colors border border-outline-variant/20 flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
          <button 
            onClick={handleGenerate} 
            disabled={selectedModules.length === 0 || isGenerating}
            className="bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
        {/* Left Sidebar - Modules */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          <div className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-4">Data Sources</h3>
            <div className="space-y-2">
              {AVAILABLE_MODULES.map((module) => (
                <label key={module.id} className="flex items-center gap-3 p-2 rounded hover:bg-surface-container-low cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedModules.includes(module.id)}
                    onChange={() => toggleModule(module.id)}
                    className="rounded bg-surface-dim border-outline-variant/30 text-primary-container focus:ring-primary-container w-4 h-4" 
                  />
                  <span className="text-sm text-on-surface">{module.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10 shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-5">Global Filters</h3>
            <div className="space-y-5">
              <CustomDropdown 
                label="Date Range" 
                options={['All Time', 'Last 12 Months', 'Last 5 Years']} 
                value={dateRange} 
                onChange={setDateRange} 
                theme="primary" 
              />
              <CustomDropdown 
                label="Content Type" 
                options={['All Content', 'Movies Only', 'TV Shows Only']} 
                value={contentType} 
                onChange={setContentType} 
                theme="tertiary" 
              />
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-3">
          {!generatedReport ? (
             <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 border-dashed flex flex-col items-center justify-center min-h-[600px] p-8 text-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6">
                  <LayoutTemplate className="w-8 h-8 text-on-surface-variant" />
                </div>
                <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Build your first report</h3>
                <p className="text-on-surface-variant max-w-md mb-8">
                  {selectedModules.length > 0 
                     ? `${selectedModules.length} module(s) selected. Click 'Generate Report' to view.` 
                     : "Select data modules from the left panel to start building. Mix genres, regions, and timelines to uncover unique insights."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  <button onClick={() => setSelectedModules(['growth', 'genres', 'regions'])} className="bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-xl p-6 text-left transition-colors group focus:outline-none focus:ring-2 focus:ring-primary-container">
                    <h4 className="font-bold text-on-surface mb-1 group-hover:text-primary-container transition-colors">Executive Summary</h4>
                    <p className="text-xs text-on-surface-variant">Pre-build template featuring growth, top genres, and regional highlights.</p>
                  </button>
                  <button onClick={() => setSelectedModules(['ratings', 'languages', 'releases'])} className="bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-xl p-6 text-left transition-colors group focus:outline-none focus:ring-2 focus:ring-tertiary">
                    <h4 className="font-bold text-on-surface mb-1 group-hover:text-tertiary transition-colors">Content Strategy</h4>
                    <p className="text-xs text-on-surface-variant">Pre-build template focusing on ratings, languages, and release patterns.</p>
                  </button>
                </div>
             </div>
          ) : (
            <div className="space-y-8 print:space-y-12">
               <div className="flex items-center justify-between bg-surface-container-high p-4 rounded-xl border border-outline-variant/10 print:hidden">
                  <h3 className="font-bold text-on-surface flex items-center gap-2">Report Generated Successfully</h3>
                  <button onClick={() => setGeneratedReport(null)} className="text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-surface-container-highest">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               
               {/* Report Visuals */}
               <div className="bg-surface-default print:block">
                  <div className="print:block hidden mb-8 border-b border-outline-variant/20 pb-4">
                     <h1 className="text-4xl font-headline font-bold text-black print:text-black">StreamIQ Analytics Report</h1>
                     <p className="text-gray-600 mt-2">Custom Executive Briefing</p>
                  </div>

                  {selectedModules.map(moduleId => {
                     const modData = generatedReport[moduleId];
                     if (!modData) return null;
                     
                     return (
                       <div key={moduleId} className="bg-surface-container-high rounded-xl border border-outline-variant/10 p-6 mb-8 break-inside-avoid print:bg-white print:border-gray-200">
                          <h3 className="text-lg font-headline font-bold text-on-surface mb-6 print:text-black">{modData.name}</h3>
                          {renderChart(moduleId, modData.data)}
                       </div>
                     )
                  })}
               </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
