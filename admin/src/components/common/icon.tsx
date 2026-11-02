import {
  BookOpen,
  Boxes,
  Briefcase,
  Circle,
  Compass,
  Cpu,
  FileText,
  FolderKanban,
  Home,
  Inbox,
  Info,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  Newspaper,
  Quote,
  Scale,
  Settings,
  Settings2,
  TriangleAlert,
  Users,
  Workflow,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

/**
 * Curated registry of the icons referenced by string name across configs.
 * Explicit imports keep the bundle tree-shakeable (vs. a `import *` barrel).
 */
const registry: Record<string, LucideIcon> = {
  LayoutDashboard,
  Home,
  Info,
  Compass,
  Boxes,
  Workflow,
  Settings,
  Settings2,
  LayoutTemplate,
  Newspaper,
  BookOpen,
  FolderKanban,
  Quote,
  Users,
  Mail,
  Layers,
  Cpu,
  Scale,
  Briefcase,
  FileText,
  Inbox,
  TriangleAlert,
  Circle,
};

/** Render a registered icon by name, with a safe fallback. */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = registry[name] ?? Circle;
  return <Cmp {...props} />;
}
