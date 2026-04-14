import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, LayoutGrid, Film, FileText, Settings, 
  HelpCircle, LogOut, Search, Bell, ChevronRight
} from 'lucide-react';

export default function AppLayout({ children, breadcrumbs }: { children: React.ReactNode, breadcrumbs?: string[] }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: LayoutGrid, label: 'DASHBOARD' },
    { path: '/content', icon: Film, label: 'CONTENT' },
    { path: '/analytics', icon: BarChart2, label: 'ANALYTICS' },
    { path: '/reports', icon: FileText, label: 'REPORTS' },
    { path: '/settings/profile', icon: Settings, label: 'SETTINGS' },
  ];

  const getBreadcrumbPath = (crumb: string) => {
    switch(crumb.toLowerCase()) {
      case 'analytics': return '/analytics';
      case 'settings': return '/settings/profile';
      case 'content': return '/content';
      case 'reports': return '/reports';
      case 'overview': return '/dashboard';
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-surface font-body text-on-surface overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-low flex flex-col border-r border-outline-variant/10 shrink-0">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 gap-3">
          <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <Link to="/dashboard" className="font-headline font-bold text-sm tracking-wide leading-tight hover:text-primary-container transition-colors">STREAMIQ</Link>
            <p className="text-[0.6rem] text-on-surface-variant uppercase tracking-widest">Directorial Suite</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border-l-2 font-medium text-sm transition-all ${
                  isActive 
                    ? 'bg-surface-container-high border-primary-container text-on-surface' 
                    : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 flex flex-col gap-4">
          <Link to="/login" className="flex items-center gap-3 text-on-surface-variant hover:text-on-surface text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            SIGN OUT
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-surface-dim">
        {/* Top Nav */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-outline-variant/10 shrink-0 bg-surface-dim">
          <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
            <Link to="/dashboard" className="hover:text-on-surface transition-colors">Home</Link>
            {breadcrumbs && breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const path = getBreadcrumbPath(crumb);
              
              return (
                <React.Fragment key={index}>
                  <ChevronRight className="w-4 h-4" />
                  {isLast || !path ? (
                    <span className={isLast ? "text-on-surface" : "text-on-surface-variant"}>
                      {crumb}
                    </span>
                  ) : (
                    <Link to={path} className="hover:text-on-surface transition-colors cursor-pointer">
                      {crumb}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          

        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
