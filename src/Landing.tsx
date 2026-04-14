import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] font-body text-white overflow-hidden relative">
      {/* Red glow effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E50914] rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#E50914] rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/3"></div>

      {/* Navbar */}
      <nav className="relative z-50 max-w-7xl mx-auto pt-8 px-6">
        <div className="bg-white rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-black text-[#E50914] tracking-tighter uppercase font-headline">StreamIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-black bg-gray-100 hover:bg-gray-200 px-6 py-2.5 rounded-full transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-sm font-semibold text-white bg-[#E50914] hover:bg-[#c0000c] px-6 py-2.5 rounded-full transition-colors shadow-lg shadow-red-500/30">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Column */}
        <div className="flex-1 space-y-8">
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tight leading-[1.1]">
            Cinematic Intelligence<br />for Streaming
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
            Elevate your content strategy with the industry's leading analytics suite. Track global trends, analyze audience DNA, and optimize your ROI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/register" className="bg-[#E50914] hover:bg-[#c0000c] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-red-500/20 text-center">
              Get Started
            </Link>
            <Link to="/login" className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-bold text-lg transition-all text-center">
              Login
            </Link>
          </div>
        </div>

        {/* Right Column - Poster Grid */}
        <div className="flex-1 relative h-[600px] w-full hidden lg:block" style={{ perspective: '1000px' }}>
          <div className="absolute inset-0 grid grid-cols-3 gap-4 scale-110 translate-x-12" style={{ transform: 'rotateY(-15deg) rotateX(5deg)' }}>
            {/* Column 1 */}
            <div className="space-y-4 -translate-y-12">
              <img src="https://i.pinimg.com/736x/1b/a5/50/1ba5502a18fc1302e59fa85caf84cda7.jpg" alt="Poster 1" className="w-full rounded-xl shadow-2xl opacity-60 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
              <img src="https://i.pinimg.com/736x/be/0b/58/be0b58915b021b4ecb1d26a0b54560a2.jpg" alt="Poster 2" className="w-full rounded-xl shadow-2xl opacity-60 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
            </div>
            {/* Column 2 */}
            <div className="space-y-4">
              <img src="https://i.pinimg.com/736x/34/a2/dd/34a2dde22e3cd8e0775ed14e6094f815.jpg" alt="Poster 3" className="w-full rounded-xl shadow-2xl border-2 border-[#E50914] relative z-10" referrerPolicy="no-referrer" />
              <img src="https://i.pinimg.com/736x/0f/f5/c8/0ff5c83cb823e75b6cd7e7cad39f81e6.jpg" alt="Poster 4" className="w-full rounded-xl shadow-2xl opacity-60 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
            </div>
            {/* Column 3 */}
            <div className="space-y-4 translate-y-12">
              <img src="https://i.pinimg.com/736x/df/46/f2/df46f2dabc0e7be66dd2b7be49395a6d.jpg" alt="Poster 5" className="w-full rounded-xl shadow-2xl opacity-60 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
              <img src="https://i.pinimg.com/736x/0f/58/a5/0f58a5481594909400681ac58be23bc0.jpg" alt="Poster 6" className="w-full rounded-xl shadow-2xl opacity-60 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
