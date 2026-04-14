import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTMDBPoster } from '../services/tmdb';

interface TitleProp {
  _id: string;
  title: string;
  type: string;
  release_year: number;
  genres: string[];
  rating: string;
  duration: string;
}

export default function TitleCard({ title }: { title: TitleProp }) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchImg = async () => {
      const url = await fetchTMDBPoster(title.title, title.type, title.release_year);
      if (mounted && url) {
        setPosterUrl(url);
      }
    };
    fetchImg();
    
    return () => { mounted = false; };
  }, [title]);

  const displayImg = posterUrl || `https://picsum.photos/seed/${title._id}/300/450`;

  return (
    <Link to={`/title/${title._id}`} state={{ title, posterUrl: displayImg }} className="group cursor-pointer block">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-surface-container-highest">
        <img 
          src={displayImg} 
          alt={title.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          referrerPolicy="no-referrer" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent opacity-80"></div>
        <div className="absolute top-2 left-2">
          <span className={`text-[0.6rem] font-bold px-2 py-1 rounded bg-surface-container-highest/80 backdrop-blur-md border border-outline-variant/20 ${title.type === 'Movie' ? 'text-primary-container' : 'text-tertiary'}`}>
            {title.type}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-xs font-bold text-white drop-shadow-md">{title.rating}</span>
          <span className="text-xs font-medium text-white/80 drop-shadow-md">{title.duration}</span>
        </div>
      </div>
      <h4 className="font-headline font-bold text-on-surface truncate group-hover:text-primary-container transition-colors">{title.title}</h4>
      <p className="text-xs text-on-surface-variant mt-0.5 truncate">{title.release_year} • {title.genres?.slice(0, 3).join(', ') || 'Various'}</p>
    </Link>
  );
}
