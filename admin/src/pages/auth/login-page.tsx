import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useLogin } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { env } from '@/lib/env';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

const HIGHLIGHTS = [
  { icon: Zap, title: 'Lightning-fast CMS', text: 'Manage every page and collection from one place.' },
  { icon: ShieldCheck, title: 'Secure by design', text: 'JWT authentication with protected routes.' },
  { icon: Sparkles, title: 'Premium experience', text: 'A refined, responsive dashboard built for teams.' },
];

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginValues) => login.mutate(values);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-violet-600 to-indigo-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-black/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <span className="text-base font-extrabold">S</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Shanvia Tech</span>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold leading-tight text-balance">
              Run your company website like a product.
            </h1>
            <p className="max-w-md text-white/80">
              A modern content management studio for blogs, projects, careers
              and every page in between.
            </p>
          </div>
          <div className="space-y-5">
            {HIGHLIGHTS.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15 backdrop-blur">
                  <item.icon className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-white/70">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-white/60">
          © {new Date().getFullYear()} Shanvia Tech Solutions Pvt Ltd
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center p-6 sm:p-10">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <div className="mb-8 space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your admin account to continue.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@shanviatech.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-10"
                  {...form.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={login.isPending}
            >
              {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          {env.enableMockFallback && (
            <p className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground">
              Demo mode is on — if the API is offline, any credentials sign you
              into a sandbox session.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
