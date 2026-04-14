import React, { useState, useRef, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import { Filter, Search, Play, Star, Clock, Calendar, ChevronDown } from 'lucide-react';
import TitleCard from './components/TitleCard';
import { discoverFromTMDB } from './services/tmdb';

export default function ContentExplorer() {
  const [titles, setTitles] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [showMovies, setShowMovies] = useState(true);
  const [showTV, setShowTV] = useState(true);
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const genreRef = useRef<HTMLDivElement>(null);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Relevance");
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genreRef.current && !genreRef.current.contains(event.target as Node)) {
        setIsGenreOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTitles = async () => {
    setLoading(true);
    try {
      if (minYear && parseInt(minYear) > 2021) {
        const data = await discoverFromTMDB(showMovies, showTV, minYear, maxYear, selectedGenre, selectedSort, searchQuery);
        setTitles(data.titles || []);
        setTotalResults(data.total || 0);
        setLoading(false);
        return;
      }

      const parts = [];
      if (searchQuery.trim().length > 0) parts.push(`search=${encodeURIComponent(searchQuery)}`);
      if (selectedGenre !== "All Genres") parts.push(`genre=${encodeURIComponent(selectedGenre)}`);
      
      const types = [];
      if (showMovies) types.push('Movie');
      if (showTV) types.push('TV Show');
      if (types.length === 1) parts.push(`type=${encodeURIComponent(types[0])}`);
      else if (types.length === 0) {
        setTitles([]);
        setTotalResults(0);
        setLoading(false);
        return;
      }

      if (minYear) parts.push(`minYear=${minYear}`);
      if (maxYear) parts.push(`maxYear=${maxYear}`);
      
      if (selectedSort === "Title (A-Z)") parts.push('sort=Title%20(A-Z)');
      
      const res = await fetch(`/api/content?limit=24&${parts.join('&')}`);
      const data = await res.json();
      setTitles(data.titles || []);
      setTotalResults(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small debounce if typing in search
    const delayDebounceFn = setTimeout(() => {
      fetchTitles();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedGenre, selectedSort, showMovies, showTV, minYear, maxYear, searchQuery]);

  const handleReset = () => {
    setShowMovies(true);
    setShowTV(true);
    setMinYear('');
    setMaxYear('');
    setSelectedGenre('All Genres');
    setSelectedSort('Relevance');
    setSearchQuery('');
  };

  const genres = ["All Genres", "Action & Adventure", "Comedies", "Dramas", "Sci-Fi & Fantasy", "Thrillers"];
  const sortOptions = ["Relevance", "Year (Newest)", "Title (A-Z)"];

  return (
    <AppLayout breadcrumbs={['Content']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Content Library</h2>
          <p className="text-on-surface-variant mt-1">Browse and filter 8,800+ titles across movies and TV shows</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input 
            type="text"
            placeholder="Search for movies or TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-high border-2 border-outline-variant/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface focus:border-primary-container focus:bg-surface focus:ring-4 focus:ring-primary-container/10 outline-none transition-all placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Panel */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">Filters</h3>
              <button onClick={handleReset} className="text-xs text-tertiary hover:underline">Reset</button>
            </div>
            
            <div className="space-y-5">
              {/* Type Filter */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2">TYPE</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                    <input type="checkbox" checked={showMovies} onChange={e => setShowMovies(e.target.checked)} className="rounded bg-surface-dim border-outline-variant/30 text-primary-container focus:ring-primary-container" />
                    Movies
                  </label>
                  <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                    <input type="checkbox" checked={showTV} onChange={e => setShowTV(e.target.checked)} className="rounded bg-surface-dim border-outline-variant/30 text-primary-container focus:ring-primary-container" />
                    TV Shows
                  </label>
                </div>
              </div>

              {/* Genre Filter */}
              <div ref={genreRef}>
                <label className="block text-xs font-bold text-on-surface-variant mb-2">GENRE</label>
                <div className="relative">
                  <div 
                    onClick={() => setIsGenreOpen(!isGenreOpen)}
                    className={`w-full bg-surface-dim border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface cursor-pointer flex items-center justify-between transition-all ${isGenreOpen ? 'border-primary-container ring-1 ring-primary-container/50' : 'hover:border-outline-variant/40'}`}
                  >
                    <span>{selectedGenre}</span>
                    <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${isGenreOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {isGenreOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-xl overflow-hidden z-20">
                      {genres.map((genre) => (
                        <div 
                          key={genre}
                          onClick={() => {
                            setSelectedGenre(genre);
                            setIsGenreOpen(false);
                          }}
                          className={`px-3 py-2 cursor-pointer transition-colors text-sm ${selectedGenre === genre ? 'bg-primary-container/10 text-primary-container font-medium' : 'text-on-surface hover:bg-surface-container-highest hover:text-primary-container'}`}
                        >
                          {genre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2">RELEASE YEAR</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={minYear} onChange={e => setMinYear(e.target.value)} placeholder="Min" className="w-full bg-surface-dim border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container" />
                  <span className="text-on-surface-variant">-</span>
                  <input type="number" value={maxYear} onChange={e => setMaxYear(e.target.value)} placeholder="Max" className="w-full bg-surface-dim border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-on-surface-variant">Showing <span className="text-on-surface font-bold">{titles.length}</span> of {totalResults.toLocaleString()} results</p>
            <div className="flex items-center gap-3" ref={sortRef}>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sort by:</span>
              <div className="relative">
                <div 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-1.5 text-sm text-on-surface cursor-pointer flex items-center justify-between gap-3 transition-all min-w-[140px] ${isSortOpen ? 'border-primary-container ring-1 ring-primary-container/50' : 'hover:border-outline-variant/40'}`}
                >
                  <span>{selectedSort}</span>
                  <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-1 w-full min-w-[140px] bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-xl overflow-hidden z-20">
                    {sortOptions.map((option) => (
                      <div 
                        key={option}
                        onClick={() => {
                          setSelectedSort(option);
                          setIsSortOpen(false);
                        }}
                        className={`px-3 py-2 cursor-pointer transition-colors text-sm ${selectedSort === option ? 'bg-primary-container/10 text-primary-container font-medium' : 'text-on-surface hover:bg-surface-container-highest hover:text-primary-container'}`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <p className="col-span-full text-on-surface-variant text-center py-10">Fetching titles...</p>
            ) : titles.length === 0 ? (
              <p className="col-span-full text-on-surface-variant text-center py-10">No titles match your filters.</p>
            ) : (
              titles.map((title) => <TitleCard key={title._id} title={title} />)
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
