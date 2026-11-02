import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/common/icon';
import { Card } from '@/components/ui/card';
import { formatCompact } from '@/lib/utils';

interface StatCardProps {
  label: string;
  total: number;
  icon: string;
  to: string;
  index?: number;
}

export function StatCard({ label, total, icon, to, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-elevated">
        <Link to={to} className="absolute inset-0" aria-label={label} />
        <div className="flex items-start justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon name={icon} className="h-5 w-5" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold tracking-tight">
            {formatCompact(total)}
          </p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}
