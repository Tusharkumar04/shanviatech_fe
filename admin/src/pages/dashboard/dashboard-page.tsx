import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import { useAuth } from '@/hooks/use-auth';
import { getModule } from '@/config/modules';
import { PageHeader } from '@/components/common/page-header';
import { Icon } from '@/components/common/icon';
import { StatCard } from '@/components/dashboard/stat-card';
import { TrendChart, DistributionChart } from '@/components/dashboard/charts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { timeAgo } from '@/lib/utils';

const QUICK_ACTIONS = ['blog', 'project', 'job', 'case-study', 'testimonial', 'technology'];

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();

  const firstName = (user?.name || user?.email || 'there').split(/[\s@]/)[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        description="Here's what's happening across your content today."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[132px] rounded-xl" />
            ))
          : data?.stats.map((stat, i) => (
              <StatCard
                key={stat.key}
                label={stat.label}
                total={stat.total}
                icon={stat.icon}
                to={`/${stat.routePath}`}
                index={i}
              />
            ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Content & engagement</CardTitle>
            <CardDescription>Last 6 months overview</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <TrendChart data={data?.trend ?? []} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content distribution</CardTitle>
            <CardDescription>Records per module</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <DistributionChart data={data?.distribution ?? []} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest content updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))
            ) : data?.activity.length ? (
              data.activity.map((item) => (
                <Link
                  key={`${item.moduleKey}-${item.id}`}
                  to={`/${getModule(item.moduleKey)?.routePath ?? ''}`}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent/50"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.moduleLabel}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {timeAgo(item.date)}
                  </span>
                </Link>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No recent activity.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Create new content fast</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((key) => {
              const module = getModule(key);
              if (!module) return null;
              return (
                <button
                  key={key}
                  onClick={() => navigate(`/${module.routePath}/new`)}
                  className="group flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={module.icon} className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Plus className="h-3.5 w-3.5" />
                    {module.singularLabel}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
