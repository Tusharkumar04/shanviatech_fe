import type { ModuleConfig } from '../module-config';
import { blogModule } from './blog';
import { caseStudyModule } from './case-study';
import { projectModule } from './project';
import { testimonialModule } from './testimonial';
import { leadershipModule } from './leadership';
import { reachModule } from './reach';
import { domainExpertiseModule } from './domain-expertise';
import { technologyModule } from './technology';
import { legalModule } from './legal';
import { jobModule } from './job';
import { jobApplicationModule } from './job-application';
import { homeModule } from './home';
import { aboutModule } from './about';
import { approachModule } from './approach';
import { serviceModule } from './service';
import { workModule } from './work';
import { siteSettingModule } from './site-setting';
import { cmsContentModule } from './cms-content';
import { productModule } from './product';

/** Collection (list + CRUD) modules. */
export const collectionModules: ModuleConfig[] = [
  blogModule,
  caseStudyModule,
  projectModule,
  testimonialModule,
  leadershipModule,
  reachModule,
  domainExpertiseModule,
  technologyModule,
  legalModule,
  jobModule,
  jobApplicationModule,
  productModule,
];

/** Single-document (create-or-update) page modules. */
export const singleModules: ModuleConfig[] = [
  homeModule,
  aboutModule,
  approachModule,
  serviceModule,
  workModule,
  siteSettingModule,
  cmsContentModule,
];

export const allModules: ModuleConfig[] = [
  ...collectionModules,
  ...singleModules,
];

export const moduleMap: Record<string, ModuleConfig> = Object.fromEntries(
  allModules.map((m) => [m.key, m]),
);

export function getModule(key: string): ModuleConfig | undefined {
  return moduleMap[key];
}

export {
  blogModule,
  caseStudyModule,
  projectModule,
  testimonialModule,
  leadershipModule,
  reachModule,
  domainExpertiseModule,
  technologyModule,
  legalModule,
  jobModule,
  jobApplicationModule,
  homeModule,
  aboutModule,
  approachModule,
  serviceModule,
workModule,
  siteSettingModule,
  cmsContentModule,
  productModule,
};
