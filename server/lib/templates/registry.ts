import { CVTemplate } from '../schemas/template';
import { iitkgpTemplate } from './iitkgp';
import { iitbTemplate } from './iitb';
import { iitmTemplate } from './iitm';
import type { TemplateId } from '../schemas/resume';

const templates: Record<TemplateId, CVTemplate> = {
  iitkgp: iitkgpTemplate,
  iitb: iitbTemplate,
  iitm: iitmTemplate,
};

export function getTemplate(id: TemplateId): CVTemplate {
  const t = templates[id];
  if (!t) throw new Error(`Unknown template: ${id}`);
  return t;
}

export function getAllTemplates(): CVTemplate[] {
  return Object.values(templates);
}

export { iitkgpTemplate, iitbTemplate, iitmTemplate };
