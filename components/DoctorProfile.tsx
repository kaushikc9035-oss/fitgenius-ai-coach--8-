import React, { useState } from 'react';
import { UserProfile } from '../types';

interface DoctorProfileProps {
  user: UserProfile;
  onSubmit: (name: string) => void;
  isLoading: boolean;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ user, onSubmit, isLoading }) => {
  const [name, setName] = useState(user.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold font-syne text-ll-text tracking-tight">Doctor Profile</h1>
        <p className="text-ll-text-muted mt-2 font-medium">Manage your professional information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-ll-surface/30 shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest ml-1">Full Name</label>
              <input
                required
                type="text"
                className="w-full bg-ll-text/5 border border-ll-text/10 rounded-2xl px-6 py-4 text-xl font-bold text-ll-text focus:ring-2 focus:ring-ll-accent/50 focus:border-ll-accent outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Smith"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <input
                disabled
                type="email"
                className="w-full bg-ll-text/5 border border-ll-text/10 rounded-2xl px-6 py-4 text-xl font-bold text-ll-text-muted opacity-50 cursor-not-allowed"
                value={user.email}
              />
              <p className="text-[10px] text-ll-text-muted/50 ml-1 italic">Email cannot be changed.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="group relative px-12 py-5 bg-ll-accent text-ll-bg font-extrabold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_var(--ll-accent)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              {isLoading ? 'Saving...' : 'Update Profile'}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-ll-accent to-ll-accent2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfile;
