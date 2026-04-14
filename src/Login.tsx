import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('streamiq_token', data.token);
      localStorage.setItem('streamiq_user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex items-center justify-center selection:bg-primary-container selection:text-on-primary-container overflow-hidden relative">
      {/* Background Narrative Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-surface"></div>
        <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
          <img className="w-full h-full object-cover" alt="Abstract cinematic background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxQe_986NTEtUDwrs7VEI6c7ZxtnH14aOWpqA0gaXS7PgyXUt8UH6cUDIL76O7Goqm-EyElogDHfwWCdu29Y8s_yYBEeUJmHT8d1x93jK202sSab3nPCV3tRxwAxouXgNtEDvmNKTtRgXAY3_7MAvMtFHqLJts3piAoYi-mwHgfFrEiPNxueevHVp7XpCvL0VnQ-sY0peKwvGqYEaYan0oQ_PJlHzkjKgLL4aKvDukw63XeK58URML5dsaVph37Yk8BlHo3B6pvWI7" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
      </div>

      {/* Main Login Shell */}
      <main className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 p-6 md:p-12 gap-0 z-10">
        {/* Branding & Visual Anchor */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-surface-container-low rounded-l-xl relative overflow-hidden">
          <div className="z-10">
            <Link to="/" className="text-2xl font-black tracking-tighter text-primary-container font-headline">StreamIQ</Link>
            <div className="mt-24">
              <h1 className="text-4xl lg:text-5xl font-black font-headline text-on-surface leading-tight tracking-tight">
                The Digital<br/><span className="text-primary-container">Auteur</span> Suite
              </h1>
              <p className="mt-6 text-on-surface-variant max-w-sm leading-relaxed font-medium">
                Welcome back to the executive suite. Your dashboard is ready.
              </p>
            </div>
          </div>
          <div className="z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-surface-container-low object-cover" alt="Analyst" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKpa31j1ZybH2Al3SwKvimbUWwHiQ6bEZIJyFWvyR2bccdC92XaM62No2e91GCBFvhjq1zpSmr83dAFYbX_JNEyRinOXN-BIjz2sHw0SGZBHGfOD3S7kdhHDYGfX9b8BwdnzS_y2b7W2JQaf-_RvoE1DBSHotJkv1aDOdmeGCy0QC1K9DBeUyyKHmPNpC2F902Gweu3H8krPspylg7yu3zg_GRYcocxtbYE6jRBp1EfghKg6ZzKbP6gftDH5wryWnJCioPmgB3Fq36" />
              <img className="w-10 h-10 rounded-full border-2 border-surface-container-low object-cover" alt="Researcher" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4KCCJ69nIOvhMI5KYOym2lxzsrnf_feau93TTcO5se0QLjcwGX_Y8ZjHswMy388cYbuKDf0bSFjRfx_hQ1XW3hgpKzDIC2F7X4cePnev5wQ53DBXM9RfMtmswtztDIAmA17_7IWHMLr2KAWH2JOVPiPRWcdALHx22R27ul0JGSrjooj7aJiM_FqRuKkDS1fxDsy5tv6grRPG_xDTk9JEpG-r-Czfe512Y3rjsfnqhbrFOV4CCnzqwenGmQ6MIY-NI3iX9MaZ7kskK" />
              <img className="w-10 h-10 rounded-full border-2 border-surface-container-low object-cover" alt="PM" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIse-ywVUwp04Qt1mcHL8iYluXkCSW44Yqt_iLu4-Vfo-fZZJxQ1G3WyiGbkperZAPVvFYmUz1Umlq7457wDV_qQaj5f7sNdPi099KaLYqR4q1HMIrA8uTsNJsBXxv87V7fPKJRRcpcwjsStt6B9Bs_SONFKfE4bap6DT1m6wv03Nf8smgjvWlC6eK2TcTADUhfYTGwNaLRCZvSnor1SzbYhvDH34nTY7kr6_gR3e9xcC4c4I8FUqE2dB2Zl2z5qis33jkAGdwkZV4" />
            </div>
            <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Join 500+ Analysts</span>
          </div>
          {/* Accent Element */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-container/10 blur-[100px] rounded-full"></div>
        </div>

        {/* Form Canvas */}
        <div className="bg-surface-container-high md:rounded-r-xl p-8 md:p-12 shadow-2xl flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 flex justify-between items-center">
              <Link to="/" className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.2em] font-bold text-on-surface-variant/60 hover:text-on-surface transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Landing Page
              </Link>
              <Link to="/" className="md:hidden text-xl font-black tracking-tighter text-primary-container font-headline">StreamIQ</Link>
            </div>
            <header className="mb-10">
              <h2 className="text-2xl font-bold font-headline text-on-surface">Welcome Back</h2>
              <p className="text-on-surface-variant mt-2">Authenticate to access your directorial suite.</p>
            </header>
            
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="analytics@streamiq.com" type="email" required />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Password</label>
                  <a href="#" className="text-[0.6875rem] font-bold text-primary-container hover:underline transition-all">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="••••••••" type="password" required />
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="text-error text-xs font-bold px-1">{error}</div>}

              {/* Submit CTA */}
              <button className="w-full cinematic-gradient text-white font-bold py-4 rounded-lg mt-8 shadow-lg shadow-primary-container/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group" type="submit">
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            
            <footer className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
              <p className="text-on-surface-variant text-sm">
                Don't have an account? 
                <Link to="/register" className="text-primary-container font-bold hover:underline transition-all ml-1">Request access</Link>
              </p>
            </footer>
          </div>
        </div>
      </main>


    </div>
  );
}
