import React from 'react';
import AppLayout from './components/AppLayout';
import { Download, Filter, MapPin } from 'lucide-react';
import createGlobe from 'cobe';

const regionalData = [
  { country: 'United States', code: 'US', count: 3689, movies: 65, shows: 35 },
  { country: 'India', code: 'IN', count: 1046, movies: 85, shows: 15 },
  { country: 'United Kingdom', code: 'GB', count: 804, movies: 55, shows: 45 },
  { country: 'Canada', code: 'CA', count: 445, movies: 60, shows: 40 },
  { country: 'France', code: 'FR', count: 393, movies: 70, shows: 30 },
  { country: 'Japan', code: 'JP', count: 318, movies: 40, shows: 60 },
  { country: 'South Korea', code: 'KR', count: 231, movies: 30, shows: 70 },
  { country: 'Spain', code: 'ES', count: 215, movies: 65, shows: 35 },
];
import { Globe2 } from 'lucide-react';

const FallbackGlobe = () => {
  return (
    <div className="w-full h-[400px] flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary-container/5 blur-[100px] rounded-full scale-150"></div>
      
      {/* The Globe */}
      <div className="relative w-72 h-72 rounded-full border border-outline-variant/20 flex items-center justify-center bg-surface-dim shadow-[0_0_80px_rgba(255,180,170,0.05)] overflow-hidden">
        
        {/* Latitude/Longitude Grid Lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 20px, #ffffff 20px, #ffffff 21px),
            repeating-linear-gradient(90deg, transparent, transparent 20px, #ffffff 20px, #ffffff 21px)
          `,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Spinning Lucide Map */}
        <div className="absolute inset-0 text-primary-container/20 flex items-center justify-center animate-[spin_24s_linear_infinite]">
            <Globe2 strokeWidth={0.5} className="w-[120%] h-[120%]" />
        </div>
        
        {/* Static Content / Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-high/80 via-transparent to-transparent rounded-full pointer-events-none"></div>
        
        {/* Markers floating on top */}
        <div className="absolute -translate-x-12 -translate-y-8 animate-pulse">
            <div className="w-3 h-3 bg-primary-container rounded-full shadow-[0_0_15px_#ffb4aa]"></div>
        </div>
        <div className="absolute translate-x-12 translate-y-12 animate-pulse" style={{ animationDelay: '1s' }}>
            <div className="w-2 h-2 bg-tertiary rounded-full shadow-[0_0_10px_#ffb4aa]"></div>
        </div>
        <div className="absolute translate-x-16 -translate-y-4 animate-pulse" style={{ animationDelay: '2s' }}>
            <div className="w-2 h-2 bg-primary-container rounded-full shadow-[0_0_10px_#ffb4aa]"></div>
        </div>
        <div className="absolute -translate-x-8 translate-y-16 animate-pulse" style={{ animationDelay: '1.5s' }}>
            <div className="w-1.5 h-1.5 bg-primary-container rounded-full shadow-[0_0_10px_#ffb4aa]"></div>
        </div>

      </div>
    </div>
  );
};

export default function RegionalDistribution() {
  return (
    <AppLayout breadcrumbs={['Analytics', 'Regional Distribution']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Regional Distribution</h2>
          <p className="text-on-surface-variant mt-1">Geographic mapping of content availability.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <button onClick={() => window.print()} className="bg-primary-container hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-surface-container-high rounded-xl border border-outline-variant/10 p-6 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-headline font-bold text-on-surface">Global Content Volume</h3>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              <label className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
                <input type="radio" name="type" defaultChecked className="text-primary-container focus:ring-primary-container bg-surface-dim border-outline-variant/30" />
                All
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
                <input type="radio" name="type" className="text-primary-container focus:ring-primary-container bg-surface-dim border-outline-variant/30" />
                Movies
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
                <input type="radio" name="type" className="text-primary-container focus:ring-primary-container bg-surface-dim border-outline-variant/30" />
                TV Shows
              </label>
            </div>
          </div>
          
          <div className="flex-1 bg-[#111111] rounded-lg border border-outline-variant/5 flex items-center justify-center relative overflow-hidden">
            <FallbackGlobe />
          </div>
        </div>

        {/* Country List */}
        <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/10">
            <h3 className="text-lg font-headline font-bold text-on-surface">Top Countries</h3>
            <p className="text-sm text-on-surface-variant mt-1">Ranked by total titles</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-3 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Country</th>
                  <th className="px-6 py-3 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant text-right">Titles</th>
                </tr>
              </thead>
              <tbody>
                {regionalData.map((data) => (
                  <tr key={data.code} className="border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-low/30 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://flagcdn.com/w20/${data.code.toLowerCase()}.png`} alt={data.country} className="w-5 h-auto rounded-sm shadow-sm" />
                        <div>
                          <p className="text-sm font-medium text-on-surface group-hover:text-primary-container transition-colors">{data.country}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden flex w-16">
                              <div className="h-full bg-primary-container" style={{ width: `${data.movies}%` }}></div>
                              <div className="h-full bg-tertiary" style={{ width: `${data.shows}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface text-right">{data.count.toLocaleString()}</td>
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
