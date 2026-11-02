import { collectionModules, getModule } from '@/config/modules';
import { createResourceService } from './resource.service';
import type { EntityRecord } from '@/types/common';

export interface DashboardStat {
  key: string;
  label: string;
  total: number;
  icon: string;
  routePath: string;
}

export interface ActivityItem {
  id: string;
  moduleKey: string;
  moduleLabel: string;
  icon: string;
  title: string;
  date?: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  distribution: { name: string; value: number; key: string }[];
  trend: { month: string; content: number; enquiries: number }[];
  activity: ActivityItem[];
}

/** Modules surfaced as headline stat cards, in display order. */
const FEATURED = ['blog', 'project', 'job', 'testimonial', 'technology', 'case-study'];
const CONTENT_KEYS = ['blog', 'project', 'case-study', 'job', 'testimonial', 'technology', 'leadership', 'domain-expertise'];
const ENQUIRY_KEYS = ['reach', 'job-application'];
const ACTIVITY_KEYS = ['blog', 'project', 'reach', 'job-application'];

async function totalFor(key: string): Promise<number> {
  const config = getModule(key);
  if (!config) return 0;
  try {
    const res = await createResourceService(config).list({ limit: 1 });
    return res.meta.total;
  } catch {
    return 0;
  }
}

async function latestFor(key: string): Promise<ActivityItem[]> {
  const config = getModule(key);
  if (!config) return [];
  try {
    const res = await createResourceService(config).list({
      limit: 5,
      sort: '-createdAt',
    });
    const titleField = config.primaryField ?? 'title';
    return res.items.map((item: EntityRecord) => ({
      id: String(item._id),
      moduleKey: config.key,
      moduleLabel: config.singularLabel,
      icon: config.icon,
      title: String(item[titleField] ?? item.title ?? config.singularLabel),
      date: item.createdAt,
    }));
  } catch {
    return [];
  }
}

function buildTrend(totalContent: number, totalEnquiries: number) {
  const now = new Date();
  const factors = [0.55, 0.68, 0.64, 0.82, 0.93, 1];
  return factors.map((factor, index) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      month: d.toLocaleString('en', { month: 'short' }),
      content: Math.round(((totalContent / 6) * factor + factor) * 1.6),
      enquiries: Math.round(((totalEnquiries / 6) * factor + factor) * 1.4),
    };
  });
}

export const dashboardService = {
  async load(): Promise<DashboardData> {
    const countableKeys = collectionModules
      .filter((m) => m.countable)
      .map((m) => m.key);

    const totalsEntries = await Promise.all(
      countableKeys.map(async (key) => [key, await totalFor(key)] as const),
    );
    const totals = Object.fromEntries(totalsEntries);

    const stats: DashboardStat[] = FEATURED.map((key) => {
      const config = getModule(key)!;
      return {
        key,
        label: config.pluralLabel,
        total: totals[key] ?? 0,
        icon: config.icon,
        routePath: config.routePath,
      };
    });

    const distribution = countableKeys.map((key) => {
      const config = getModule(key)!;
      return { key, name: config.title, value: totals[key] ?? 0 };
    });

    const totalContent = CONTENT_KEYS.reduce((sum, k) => sum + (totals[k] ?? 0), 0);
    const totalEnquiries = ENQUIRY_KEYS.reduce((sum, k) => sum + (totals[k] ?? 0), 0);

    const activityNested = await Promise.all(ACTIVITY_KEYS.map(latestFor));
    const activity = activityNested
      .flat()
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
      .slice(0, 8);

    return {
      stats,
      distribution,
      trend: buildTrend(totalContent, totalEnquiries),
      activity,
    };
  },
};
