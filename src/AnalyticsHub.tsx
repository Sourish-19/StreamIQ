import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { 
  PieChart, Globe, TrendingUp, MessageSquare, 
  Star, Users, Calendar, PlusSquare, ArrowRight 
} from 'lucide-react';

const modules = [
  { id: 1, title: 'Genre Analysis', desc: 'Distribution and trends across content categories.', icon: PieChart, color: 'text-primary-container', bg: 'bg-primary-container/10', border: 'border-primary-container', path: '/analytics/genres' },
  { id: 2, title: 'Regional Distribution', desc: 'Geographic mapping of content availability.', icon: Globe, color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary', path: '/analytics/regions' },
  { id: 3, title: 'Growth Trends', desc: 'Monthly content addition volume over time.', icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary', path: '/analytics/growth' },
  { id: 4, title: 'Language Analysis', desc: 'Original language and dubbing distribution.', icon: MessageSquare, color: 'text-primary-container', bg: 'bg-primary-container/10', border: 'border-primary-container', path: '/analytics/languages' },
  { id: 5, title: 'Rating Analysis', desc: 'Age group and content rating breakdowns.', icon: Star, color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary', path: '/analytics/ratings' },
  { id: 7, title: 'Release Patterns', desc: 'Temporal analysis of content drops.', icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary', path: '/analytics/release-patterns' },
  { id: 8, title: 'Custom Report Builder', desc: 'Build bespoke reports from multiple modules.', icon: PlusSquare, color: 'text-on-surface', bg: 'bg-surface-container-highest', border: 'border-outline-variant/30', path: '/analytics/custom' },
];

export default function AnalyticsHub() {
  return (
    <AppLayout breadcrumbs={['Analytics']}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Analytics Hub</h2>
        <p className="text-on-surface-variant mt-1">Deep-dive into Netflix data across genres, regions, trends, and more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.id} to={mod.path} className={`bg-surface-container-high rounded-xl p-6 border-l-2 ${mod.border} hover:bg-surface-container-highest transition-colors group cursor-pointer flex flex-col h-full`}>
              <div className={`w-10 h-10 rounded-lg ${mod.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${mod.color}`} />
              </div>
              <h3 className="text-lg font-headline font-bold text-on-surface mb-2">{mod.title}</h3>
              <p className="text-sm text-on-surface-variant flex-1">{mod.desc}</p>
              <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary-container transition-colors">
                Explore Module <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
}
