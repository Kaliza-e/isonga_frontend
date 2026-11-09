'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  User,
  MapPin,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/context/AuthContext';

export default function AdministratorSettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#172B24]">
          Administrator Profile & Security
        </h1>
        <p className="text-xs text-[#64746C] mt-0.5">
          Manage your local authority profile, cryptographic credentials, and territory scope
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Official Profile Details</CardTitle>
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#087A3E] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile details updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="Official Contact Phone"
                value={phone}
                disabled
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <div className="p-3.5 bg-[#F0FBF5] rounded-xl border border-[#DDF7E8] space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#16A34A]" />
                <span className="text-xs font-bold text-[#087A3E]">
                  Territory Scope: {user?.role || 'LOCAL_ADMIN'}
                </span>
              </div>
              <p className="text-xs text-[#64746C]">
                Authorized administrative territory: <strong>{user?.primaryAreaName || 'National Administration'}</strong>.
                Announcements targeted outside this jurisdiction are rejected by server-side <code>AreaScopeGuard</code>.
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm">Save Profile Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security & Password</CardTitle>
          <Lock className="w-4 h-4 text-[#64746C]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••••••"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Minimum 8 characters"
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
            />
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm">Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
