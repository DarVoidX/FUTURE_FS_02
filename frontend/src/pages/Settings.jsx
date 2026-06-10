import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Zap, Shield, Loader2, Save, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../api/auth';
import toast from 'react-hot-toast';

const Section = ({ title, icon: Icon, description, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.25 }}
  >
    <div className="flex items-start gap-6">
      {/* Left column: label */}
      <div className="w-56 flex-shrink-0 hidden md:block pt-1">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={14} style={{ color: 'var(--color-accent)' }} />
          <span className="text-sm font-semibold text-text-1">{title}</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>

      {/* Right column: content */}
      <div className="flex-1 card p-6">
        <div className="md:hidden flex items-center gap-2 mb-5">
          <Icon size={14} style={{ color: 'var(--color-accent)' }} />
          <span className="text-sm font-semibold text-text-1">{title}</span>
        </div>
        {children}
      </div>
    </div>
  </motion.div>
);

const TIMEZONES = ['UTC','America/New_York','America/Chicago','America/Los_Angeles','Europe/London','Asia/Kolkata','Asia/Tokyo','Australia/Sydney'];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email:    user?.email    || '',
    company:  user?.company  || '',
    timezone: user?.timezone || 'UTC',
  });
  const [passwords, setPasswords] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [show, setShow] = useState({ cur: false, new: false, con: false });
  const [pLoading, setPLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [pin, setPin] = useState('');
  const [pinPassed, setPinPassed] = useState(false);
  const [pinError, setPinError] = useState(false);

  const handlePinVerify = (e) => {
    e.preventDefault();
    if (pin === '0000') {
      setPinPassed(true);
      setPinError(false);
      toast.success('Security gate unlocked');
    } else {
      setPinError(true);
      toast.error('Incorrect PIN. Hint: Default is 0000');
    }
  };

  const initials = (user?.fullName || user?.username || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);

  const saveProfile = async e => {
    e.preventDefault(); setPLoading(true);
    try { const d = await updateProfile(profile); updateUser(d.user); toast.success('Profile updated'); }
    catch(err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setPLoading(false); }
  };

  const savePwd = async e => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords don\'t match'); return; }
    if (passwords.newPassword.length < 6) { toast.error('Minimum 6 characters'); return; }
    setPwLoading(true);
    try { await changePassword(passwords.currentPassword, passwords.newPassword); toast.success('Password changed'); setPasswords({ currentPassword:'', newPassword:'', confirmPassword:'' }); }
    catch(err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setPwLoading(false); }
  };

  return (
    <Layout pageTitle="Settings" pageSubtitle="Manage your account and preferences">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">
        {/* Left Side: Forms (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* ─── Profile card ─── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-5 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
              style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-text-1 tracking-snug-2 font-display">
                {user?.fullName || user?.username}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{user?.email || 'No email set'}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Shield size={11} style={{ color: 'var(--color-accent)' }} />
                <span className="text-xs font-semibold capitalize" style={{ color: 'var(--color-accent)' }}>{user?.role}</span>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'var(--color-success-dim)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <CheckCircle2 size={11}/> Active
            </span>
          </motion.div>

          <div className="divider" />

          {/* ─── Profile form ─── */}
          <Section
            title="Profile"
            icon={User}
            description="Update your display name, email, and company information."
            delay={0.08}
          >
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Full Name</label>
                  <input className="input text-[15px]" value={profile.fullName}
                    onChange={e => setProfile(p => ({...p, fullName: e.target.value}))} placeholder="Your name" />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input className="input text-[15px]" type="email" value={profile.email}
                    onChange={e => setProfile(p => ({...p, email: e.target.value}))} placeholder="you@company.com" />
                </div>
                <div>
                  <label className="input-label">Company</label>
                  <input className="input text-[15px]" value={profile.company}
                    onChange={e => setProfile(p => ({...p, company: e.target.value}))} placeholder="Your company" />
                </div>
                <div>
                  <label className="input-label">Timezone</label>
                  <select className="input text-[15px]" value={profile.timezone}
                    onChange={e => setProfile(p => ({...p, timezone: e.target.value}))}>
                    {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="input-label">Username</label>
                <input className="input opacity-50 cursor-not-allowed" value={user?.username} disabled readOnly />
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>Username cannot be changed</p>
              </div>
              <button type="submit" className="btn-primary" disabled={pLoading}>
                {pLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13}/>}
                {pLoading ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </Section>

          <div className="divider" />

          {/* ─── Password form ─── */}
          <Section
            title="Security"
            icon={Lock}
            description="Change your password. Use a strong, unique password."
            delay={0.16}
          >
            {!pinPassed ? (
              <form onSubmit={handlePinVerify} className="space-y-4 max-w-sm">
                <div>
                  <label className="input-label">Enter Security Password</label>
                  <p className="text-xs text-text-3 mb-3">Please enter the security password to unlock password settings.</p>
                  <input
                    className={`input text-center text-base font-bold font-mono ${pinError ? 'border-[var(--color-danger)]' : ''}`}
                    type="password"
                    placeholder="••••••••"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center text-sm">
                  Verify & Unlock
                </button>
                <p className="text-xs text-center mt-3 text-text-3">
                  Contact owner of this website: <a href="mailto:darshannaidu696@gmail.com" className="hover:underline font-semibold" style={{ color: 'var(--color-accent)' }}>darshannaidu696@gmail.com</a>
                </p>
              </form>
            ) : (
              <form onSubmit={savePwd} className="space-y-4">
                {[
                  { key: 'currentPassword', label: 'Current password', show: 'cur' },
                  { key: 'newPassword',     label: 'New password',     show: 'new' },
                  { key: 'confirmPassword', label: 'Confirm password', show: 'con' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="input-label">{f.label}</label>
                    <div className="relative">
                      <input
                        className="input pr-10 text-[15px]"
                        type={show[f.show] ? 'text' : 'password'}
                        value={passwords[f.key]}
                        onChange={e => setPasswords(p => ({...p, [f.key]: e.target.value}))}
                        placeholder="••••••••"
                        required
                      />
                      <button type="button"
                        onClick={() => setShow(p => ({...p, [f.show]: !p[f.show]}))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        {show[f.show] ? <EyeOff size={14}/> : <Eye size={14}/>}
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" className="btn-primary" disabled={pwLoading}>
                  {pwLoading ? <Loader2 size={13} className="animate-spin"/> : <Lock size={13}/>}
                  {pwLoading ? 'Updating…' : 'Change password'}
                </button>
              </form>
            )}
          </Section>

          <div className="divider" />

          {/* ─── System info ─── */}
          <Section title="System" icon={Zap} description="Platform and account information." delay={0.22}>
            <div className="space-y-0.5">
              {[
                { label: 'Platform',    value: 'OrbitFlow CRM' },
                { label: 'Role',        value: user?.role ? user.role[0].toUpperCase() + user.role.slice(1) : 'Admin' },
                { label: 'Member since',value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) : 'N/A' },
                { label: 'Status',      value: 'Active & Secure'    },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3"
                  style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span className="text-sm font-semibold text-text-1">{value}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Right Side: Editorial Banner (2 cols) */}
        <div className="lg:col-span-2 hidden lg:block space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card overflow-hidden h-fit sticky top-24"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src="/settings_banner.png"
                alt="OrbitFlow Banner"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/70 font-mono">Secure Cloud Environment</span>
                <h3 className="text-xl font-extrabold font-display leading-tight mt-1 text-white">OrbitFlow CRM</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Your workstation configuration, billing preferences, and account metadata are hosted inside our secure, military-grade JWT authorization structure. Any profiles modified here immediately propagate in real-time across the client application framework.
              </p>
              <div className="divider" />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Security Shield</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">● Active & Protected</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Database Host</span>
                  <span className="font-bold text-text-1">MongoDB Atlas Cluster</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Connection Type</span>
                  <span className="font-bold text-text-1">SSL Encrypted Socket</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
