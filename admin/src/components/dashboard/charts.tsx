import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DashboardData } from '@/services/dashboard.service';

const AXIS = { fontSize: 12, fill: 'hsl(var(--muted-foreground))' };

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--popover))',
  color: 'hsl(var(--popover-foreground))',
  fontSize: 12,
  boxShadow: '0 10px 30px -10px rgb(0 0 0 / 0.2)',
};

const BAR_COLORS = [
  'hsl(245 75% 60%)',
  'hsl(265 70% 62%)',
  'hsl(199 80% 50%)',
  'hsl(152 60% 45%)',
  'hsl(38 92% 55%)',
  'hsl(330 75% 60%)',
  'hsl(220 70% 55%)',
  'hsl(280 65% 60%)',
];

export function TrendChart({ data }: { data: DashboardData['trend'] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="fillContent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillEnquiries" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(199 80% 50%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(199 80% 50%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
        />
        <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'hsl(var(--border))' }} />
        <Area
          type="monotone"
          dataKey="content"
          name="Content"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#fillContent)"
        />
        <Area
          type="monotone"
          dataKey="enquiries"
          name="Enquiries"
          stroke="hsl(199 80% 50%)"
          strokeWidth={2}
          fill="url(#fillEnquiries)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DistributionChart({
  data,
}: {
  data: DashboardData['distribution'];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="hsl(var(--border))"
        />
        <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--muted))' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((_, index) => (
            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
