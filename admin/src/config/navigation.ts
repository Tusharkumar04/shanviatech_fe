/** Sidebar navigation model. Icons are lucide-react names resolved at render. */
export interface NavItem {
  label: string;
  to: string;
  icon: string;
  /** Optional module key this nav item maps to. */
  moduleKey?: string;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/', icon: 'LayoutDashboard' }],
  },
  {
    title: 'CMS Pages',
    items: [
      { label: 'Home', to: '/home', icon: 'Home', moduleKey: 'home' },
      { label: 'About', to: '/about', icon: 'Info', moduleKey: 'about' },
      { label: 'Approach', to: '/approach', icon: 'Compass', moduleKey: 'approach' },
      { label: 'Service', to: '/service', icon: 'Boxes', moduleKey: 'service' },
      { label: 'Work', to: '/work', icon: 'Workflow', moduleKey: 'work' },
      { label: 'Product', to: '/product', icon: 'Package', moduleKey: 'product' },
      {
        label: 'Site Settings',
        to: '/site-setting',
        icon: 'Settings',
        moduleKey: 'site-setting',
      },
      {
        label: 'CMS Content',
        to: '/cms-content',
        icon: 'LayoutTemplate',
        moduleKey: 'cms-content',
      },
    ],
  },
  {
    title: 'Content Management',
    items: [
      { label: 'Blog', to: '/blog', icon: 'Newspaper', moduleKey: 'blog' },
      { label: 'Case Study', to: '/case-study', icon: 'BookOpen', moduleKey: 'case-study' },
      { label: 'Projects', to: '/project', icon: 'FolderKanban', moduleKey: 'project' },
      { label: 'Testimonials', to: '/testimonial', icon: 'Quote', moduleKey: 'testimonial' },
      { label: 'Leadership', to: '/leadership', icon: 'Users', moduleKey: 'leadership' },
      { label: 'Reach', to: '/reach', icon: 'Mail', moduleKey: 'reach' },
      {
        label: 'Domain Expertise',
        to: '/domain-expertise',
        icon: 'Layers',
        moduleKey: 'domain-expertise',
      },
      { label: 'Technology', to: '/technology', icon: 'Cpu', moduleKey: 'technology' },
      { label: 'Legal', to: '/legal', icon: 'Scale', moduleKey: 'legal' },
      { label: 'Jobs', to: '/job', icon: 'Briefcase', moduleKey: 'job' },
      {
        label: 'Job Applications',
        to: '/job-application',
        icon: 'FileText',
        moduleKey: 'job-application',
      },
      { label: 'Products', to: '/product', icon: 'Package', moduleKey: 'product' },
    ],
  },
  {
    title: 'Chatbot',
    items: [
      { label: 'Survey Queries', to: '/survey-query', icon: 'ClipboardList', moduleKey: 'survey-query' },
      { label: 'Survey Responses', to: '/survey-response', icon: 'MessageSquare', moduleKey: 'survey-response' },
    ],
  },
  {
    title: 'System',
    items: [{ label: 'Settings', to: '/settings', icon: 'Settings2' }],
  },
];
