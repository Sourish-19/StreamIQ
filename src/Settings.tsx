import React, { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import { 
  User, Sliders, Key, Users, ShieldAlert, 
  CheckCircle2, Camera, Mail, Briefcase
} from 'lucide-react';

export default function Settings() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('streamiq_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "January 15, 2026";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <AppLayout breadcrumbs={['Settings', 'Profile']}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Profile & Account</h2>
          <p className="text-on-surface-variant mt-1">Manage your personal information and security preferences.</p>
        </div>

        <div className="space-y-8">
          
          {/* Personal Info Form */}
          <section className="bg-surface-container-high rounded-xl p-8">
            <h3 className="text-lg font-headline font-bold text-on-surface mb-6">Personal Information</h3>
            
            <form key={user?._id || "loading"} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input 
                      className="w-full bg-surface-container-low border border-transparent rounded-lg py-3 pl-12 pr-4 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none" 
                      defaultValue={user?.fullName || ""}
                      type="text" 
                    />
                  </div>
                </div>

                {/* Role (Read Only) */}
                <div className="space-y-2">
                  <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant px-1">Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
                    <input 
                      className="w-full bg-surface-dim border border-transparent rounded-lg py-3 pl-12 pr-4 text-on-surface-variant/50 cursor-not-allowed outline-none capitalize" 
                      defaultValue={user?.role || ""}
                      type="text" 
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input 
                    className="w-full bg-surface-container-low border border-transparent rounded-lg py-3 pl-12 pr-32 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none" 
                    defaultValue={user?.email || ""}
                    type="email" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-tertiary/10 text-tertiary px-2 py-1 rounded text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button className="bg-primary-container hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20">
                  Save Changes
                </button>
                <button className="text-on-surface-variant hover:text-on-surface text-xs font-bold uppercase tracking-widest px-4 py-3 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </section>

          {/* Account Stats */}
          <section className="bg-surface-container-high rounded-xl p-8 flex items-center justify-between">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Account Created</p>
              <p className="text-on-surface font-medium">{formatDate(user?.createdAt)}</p>
            </div>
            <div className="w-px h-10 bg-outline-variant/20"></div>
            <div>
              <p className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Last Login</p>
              <p className="text-on-surface font-medium">Today, 09:41 AM</p>
            </div>
            <div className="w-px h-10 bg-outline-variant/20"></div>
            <div>
              <p className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Plan</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <p className="text-on-surface font-medium">Pro Edition</p>
              </div>
            </div>
          </section>


        </div>
      </div>
    </AppLayout>
  );
}
