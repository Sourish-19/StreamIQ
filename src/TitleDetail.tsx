import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { ArrowLeft, Play, Clock, Calendar, Star, Globe, Activity, TrendingUp, Compass, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchTMDBTrailer } from './services/tmdb';

export default function TitleDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title;
  const posterUrl = location.state?.posterUrl;

  const [simulatedData, setSimulatedData] = useState<any[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  useEffect(() => {
    if (!title) {
      navigate('/content');
      return;
    }

    // Fetch trailer
    const loadTrailer = async () => {
      setLoadingTrailer(true);
      const url = await fetchTMDBTrailer(title.title, title.type, title.release_year, title._id);
      if (url) {
        setTrailerUrl(url);
      } else {
        // Fallback to youtube search
        setTrailerUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(`${title.title} ${title.type} trailer`)}`);
      }
      setLoadingTrailer(false);
    };
    loadTrailer();

    // Generate some simulated retention or engagement data for the chart to make it look "directorial"
    const data = [];
    let currentScore = Math.random() * 40 + 60; // Start high
    for (let i = 1; i <= 30; i++) {
      data.push({
        day: `Day ${i}`,
        engagement: Math.floor(currentScore),
        retention: Math.floor(currentScore * 0.8)
      });
      // decay or bump
      currentScore = Math.max(10, currentScore - (Math.random() * 5 - 1));
    }
    setSimulatedData(data);
  }, [title, navigate]);

  if (!title) return null;

  const handlePlay = () => {
    if (trailerUrl) {
      window.open(trailerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AppLayout breadcrumbs={['Content', title.title]}>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Poster & Quick Stats */}
        <div className="w-full lg:w-1/3 xl:w-1/4 shrink-0 space-y-6">
          <div className="rounded-2xl overflow-hidden bg-surface-container-highest shadow-2xl relative aspect-[2/3] group">
            {posterUrl && posterUrl.includes('http') ? (
              <img src={posterUrl} alt={title.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-dim text-on-surface-variant font-headline text-2xl text-center p-6 border border-outline-variant/10 rounded-2xl">
                {title.title}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button 
                onClick={handlePlay}
                disabled={loadingTrailer}
                className="bg-primary-container text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 shadow-lg shadow-primary-container/30 hover:bg-[#c0000c] transition-colors disabled:opacity-50"
              >
                {loadingTrailer ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Play Trailer
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10 shadow-lg shadow-black/20">
            <h3 className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Core Metadata</h3>
            
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary-container" />
                <div>
                  <p className="text-[0.6rem] text-on-surface-variant uppercase tracking-widest">Released</p>
                  <p className="text-sm font-medium text-on-surface">{title.release_year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-tertiary" />
                <div>
                  <p className="text-[0.6rem] text-on-surface-variant uppercase tracking-widest">Duration</p>
                  <p className="text-sm font-medium text-on-surface">{title.duration || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-secondary" style={{ color: '#ffb433' }} />
                <div>
                  <p className="text-[0.6rem] text-on-surface-variant uppercase tracking-widest">Rating</p>
                  <p className="text-sm font-medium text-on-surface">{title.rating || 'Unrated'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-primary-fixed" style={{ color: '#4cd6ff' }} />
                <div>
                  <p className="text-[0.6rem] text-on-surface-variant uppercase tracking-widest">Regions</p>
                  <p className="text-sm font-medium text-on-surface line-clamp-2">
                    {title.countries && title.countries.length > 0 ? title.countries.join(', ') : 'Global Release'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Details */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-[0.6rem] font-bold px-2 py-1 rounded border border-outline-variant/20 uppercase tracking-widest ${title.type === 'Movie' ? 'bg-primary-container/10 text-primary-container' : 'bg-tertiary/10 text-tertiary'}`}>
                {title.type}
              </span>
              {title.genres?.map((g: string) => (
                <span key={g} className="text-[0.6rem] font-bold px-2 py-1 rounded bg-surface-dim border border-outline-variant/20 text-on-surface-variant uppercase tracking-widest">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight leading-tight">
              {title.title}
            </h1>
            <p className="text-on-surface-variant mt-4 text-base md:text-lg leading-relaxed max-w-4xl">
              {title.description || 'No detailed synopsis available for this title in the current content repository.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 xl:gap-6">
            <div className="bg-surface-container-high rounded-xl p-5 border-l-2 border-primary-container shadow-lg shadow-black/20">
              <div className="flex justify-between items-start mb-2">
                <TrendingUp className="w-4 h-4 text-primary-container" />
              </div>
              <h4 className="text-2xl font-bold font-headline text-on-surface">{(Math.random() * 80 + 10).toFixed(1)}M</h4>
              <p className="text-[0.6rem] xl:text-[0.6875rem] tracking-widest font-bold text-on-surface-variant mt-1 uppercase">Est. Lifetime Viewers</p>
            </div>
            
            <div className="bg-surface-container-high rounded-xl p-5 border-l-2 border-tertiary shadow-lg shadow-black/20">
              <div className="flex justify-between items-start mb-2">
                <Activity className="w-4 h-4 text-tertiary" />
              </div>
              <h4 className="text-2xl font-bold font-headline text-on-surface">{(Math.random() * 20 + 75).toFixed(1)}%</h4>
              <p className="text-[0.6rem] xl:text-[0.6875rem] tracking-widest font-bold text-on-surface-variant mt-1 uppercase">Completion Rate</p>
            </div>

            <div className="bg-surface-container-high rounded-xl p-5 border-l-2 border-secondary shadow-lg shadow-black/20">
              <div className="flex justify-between items-start mb-2">
                <Compass className="w-4 h-4 text-secondary" style={{ color: '#ffb433' }} />
              </div>
              <h4 className="text-2xl font-bold font-headline text-on-surface">#{Math.floor(Math.random() * 100) + 1}</h4>
              <p className="text-[0.6rem] xl:text-[0.6875rem] tracking-widest font-bold text-on-surface-variant mt-1 uppercase">Global Rank</p>
            </div>
          </div>

          {/* Simulated Chart Box */}
          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10 shadow-lg shadow-black/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-headline font-bold text-on-surface">Audience Engagement Trajectory</h3>
                <p className="text-sm text-on-surface-variant">Simulated first 30 days performance</p>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulatedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e50914" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e50914" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#5e3f3b" strokeOpacity={0.15} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#e9bcb6', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#e9bcb6', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1b1b', border: 'none', borderRadius: '8px', color: '#e5e2e1' }}
                    itemStyle={{ color: '#e5e2e1', fontWeight: 'bold' }}
                    labelStyle={{ color: '#e9bcb6' }}
                  />
                  <Area type="monotone" name="Relative Engagement" dataKey="engagement" stroke="#e50914" strokeWidth={3} fillOpacity={1} fill="url(#colorEngage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {title.cast && title.cast.length > 0 && title.cast[0] !== "" && (
            <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10 shadow-lg shadow-black/20">
              <h3 className="text-lg font-headline font-bold text-on-surface mb-4">Principal Cast & Crew</h3>
              <div className="flex flex-wrap gap-2">
                {title.cast.map((actor: string) => (
                  <span key={actor} className="px-3 py-1.5 bg-surface-dim rounded-lg text-sm font-medium text-on-surface-variant border border-outline-variant/10">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
