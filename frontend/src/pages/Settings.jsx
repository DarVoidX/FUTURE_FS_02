import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Lock, Building2, Globe, Shield, Loader2,
  Save, Eye, EyeOff, CheckCircle2, Zap
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../api/auth';
import toast from 'react-hot-toast';

const SectionCard = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="rounded-2xl p-6"
    style={{
      background: 'rgba(18, 26, 42, 0.8)',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
    }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(0,229,255,0.1)' }}>
        <Icon size={16} style={{ color: '#00E5FF' }} />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const Settings = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    company: user?.company || '',
    timezone: user?.timezone || 'UTC',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const data = await updateProfile(profile);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPwdLoading(true);
    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  const TIMEZONES = ['UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'];

  return (
    <Layout pageTitle="Settings">
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-white">Account Settings</h2>
          <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>Manage your profile and security settings</p>
        </div>

        {/* Profile Card (read only) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(124,58,237,0.05) 100%)',
            border: '1px solid rgba(0,229,255,0.15)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)', color: 'white', boxShadow: '0 0 24px rgba(0,229,255,0.3)' }}
            >
              {user?.fullName?.[0] || user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{user?.fullName || user?.username}</p>
              <p className="text-sm" style={{ color: '#94A3B8' }}>{user?.email || 'No email set'}</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield size={12} style={{ color: '#00E5FF' }} />
                <span className="text-xs font-semibold capitalize" style={{ color: '#00E5FF' }}>
                  {user?.role}
                </span>
              </div>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle2 size={12} /> Active
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile */}
        <SectionCard title="Profile Information" icon={User} delay={0.1}>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Full Name</label>
                <input
                  className="input-field"
                  value={profile.fullName}
                  onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="label-field">Email Address</label>
                <input
                  className="input-field"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="label-field">Company</label>
                <input
                  className="input-field"
                  value={profile.company}
                  onChange={(e) => setProfile(p => ({ ...p, company: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="label-field">Timezone</label>
                <select
                  className="input-field"
                  value={profile.timezone}
                  onChange={(e) => setProfile(p => ({ ...p, timezone: e.target.value }))}
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz} style={{ background: '#121A2A' }}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label-field">Username</label>
              <input
                className="input-field opacity-60 cursor-not-allowed"
                value={user?.username}
                disabled
                readOnly
              />
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>Username cannot be changed</p>
            </div>

            <button type="submit" className="btn-primary" disabled={profileLoading}>
              {profileLoading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {profileLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </SectionCard>

        {/* Change Password */}
        <SectionCard title="Security" icon={Lock} delay={0.2}>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { key: 'currentPassword', label: 'Current Password', showKey: 'current' },
              { key: 'newPassword', label: 'New Password', showKey: 'new' },
              { key: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm' },
            ].map(({ key, label, showKey }) => (
              <div key={key}>
                <label className="label-field">{label}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    className="input-field pl-9 pr-10"
                    type={showPwd[showKey] ? 'text' : 'password'}
                    value={passwords[key]}
                    onChange={(e) => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => ({ ...p, [showKey]: !p[showKey] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPwd[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}

            <button type="submit" className="btn-primary" disabled={pwdLoading}>
              {pwdLoading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
              {pwdLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </SectionCard>

        {/* System Info */}
        <SectionCard title="System Information" icon={Zap} delay={0.3}>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Platform', value: 'OrbitFlow CRM v1.0.0' },
              { label: 'Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin' },
              { label: 'Account Created', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A' },
              { label: 'Status', value: 'Active & Secure' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#64748B' }}>{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Layout>
  );
};

export default Settings;
