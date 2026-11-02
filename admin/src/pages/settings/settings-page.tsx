import { LogOut, Monitor, Moon, Sun } from 'lucide-react';
import { useAuth, useLogout } from '@/hooks/use-auth';
import { useUIStore, type Theme } from '@/store/ui-store';
import { env } from '@/lib/env';
import { PageHeader } from '@/components/common/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export function SettingsPage() {
  const { user } = useAuth();
  const logout = useLogout();
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and application preferences."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-lg">
                  {(user?.name || user?.email || 'A').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={user?.name ?? ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user?.email ?? ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input defaultValue={user?.role ?? 'admin'} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Choose your theme.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2">
              {THEMES.map(({ value, label, icon: IconCmp }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border p-3 text-xs font-medium transition-colors',
                    theme === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-accent',
                  )}
                >
                  <IconCmp className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <CardDescription>API: {env.apiUrl}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
