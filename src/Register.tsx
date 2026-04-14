import { useState, useRef, useEffect } from 'react';
import { User, Mail, Briefcase, Lock, ShieldCheck, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles = ["Analyst", "Researcher", "PM", "Developer"];

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

      {/* Main Registration Shell */}
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
                Enter the executive suite of cinematic analytics. Harness real-time metadata to drive global content strategy.
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
        <div className="bg-surface-container-high md:rounded-r-xl p-8 md:p-12 shadow-2xl">
          <div className="max-w-md mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <Link to="/" className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.2em] font-bold text-on-surface-variant/60 hover:text-on-surface transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Landing Page
              </Link>
              <Link to="/" className="md:hidden text-xl font-black tracking-tighter text-primary-container font-headline">StreamIQ</Link>
            </div>
            <header className="mb-10">
              <h2 className="text-2xl font-bold font-headline text-on-surface">Secure Access</h2>
              <p className="text-on-surface-variant mt-2">Initialize your analyst credentials to begin.</p>
            </header>
            
            <form className="space-y-5" onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
              }
              if (!selectedRole) {
                setError("Please select a role");
                return;
              }
              
              try {
                const res = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    fullName: name, 
                    email, 
                    password, 
                    role: selectedRole.toLowerCase() 
                  })
                });
                
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Registration failed');
                
                localStorage.setItem('streamiq_token', data.token);
                localStorage.setItem('streamiq_user', JSON.stringify(data));
                navigate('/dashboard');
              } catch(err: any) {
                setError(err.message);
              }
            }}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="John Wick" type="text" required />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="analytics@streamiq.com" type="email" required />
                </div>
              </div>

              {/* Role Selector */}
              <div className="space-y-2" ref={dropdownRef}>
                <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant px-1">Organization Role</label>
                <div className="relative">
                  <div 
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className={`w-full bg-surface-container-low rounded-lg py-3.5 pl-12 pr-10 text-on-surface cursor-pointer transition-all flex items-center justify-between ${isRoleDropdownOpen ? 'ring-1 ring-primary-container' : ''}`}
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className={selectedRole ? "text-on-surface" : "text-on-surface-variant/40"}>
                      {selectedRole || "Select Role"}
                    </span>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  {isRoleDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-xl overflow-hidden z-20">
                      {roles.map((role) => (
                        <div 
                          key={role}
                          onClick={() => {
                            setSelectedRole(role);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors text-sm ${selectedRole === role ? 'bg-primary-container/10 text-primary-container font-medium' : 'text-on-surface hover:bg-surface-container-highest hover:text-primary-container'}`}
                        >
                          {role}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Passwords Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant px-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="••••••••" type="password" minLength={6} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant px-1">Confirm</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary-container transition-all outline-none" placeholder="••••••••" type="password" minLength={6} required />
                  </div>
                </div>
              </div>

              {error && <div className="text-error text-xs font-bold px-1">{error}</div>}

              {/* Submit CTA */}
              <button className="w-full cinematic-gradient text-white font-bold py-4 rounded-lg mt-6 shadow-lg shadow-primary-container/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group" type="submit">
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            
            <footer className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
              <p className="text-on-surface-variant text-sm">
                Already part of the network? 
                <Link to="/login" className="text-primary-container font-bold hover:underline transition-all ml-1">Log in here</Link>
              </p>
            </footer>
          </div>
        </div>
      </main>


    </div>
  );
}
