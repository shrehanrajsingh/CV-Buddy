import type { Resume, Section, TemplateId } from '../schemas/resume';
import { getTemplate } from '../templates/registry';
import { genId } from '../utils/id';

export function createDefaultResume(templateId: TemplateId, title?: string): Resume {
  const template = getTemplate(templateId);
  const now = new Date().toISOString();

  const defaultSections: Section[] = template.defaultSectionOrder.map((type) => {
    switch (type) {
      case 'education':
        return {
          type: 'education' as const,
          id: genId(),
          title: 'Education',
          entries: [
            {
              id: genId(),
              degree: 'B.Tech, Computer Science and Engineering',
              institution: template.name,
              year: '2025',
              score: '8.50',
              scoreType: 'cgpa' as const,
            },
          ],
        };
      case 'projects':
        return {
          type: 'projects' as const,
          id: genId(),
          title: 'Internships and Projects',
          entries: [
            {
              id: genId(),
              title: 'Project Title',
              timeline: "Jan'24 - May'24",
              supervisor: 'Prof. Supervisor Name',
              bullets: [
                'Describe what you built or accomplished',
                'Mention technologies used and impact',
              ],
              links: [],
            },
          ],
        };
      case 'skills':
        return {
          type: 'skills' as const,
          id: genId(),
          title: 'Skills and Expertise',
          categories: [
            { id: genId(), category: 'Programming Languages', items: ['Python', 'C++', 'JavaScript'] },
            { id: genId(), category: 'Frameworks', items: ['React', 'Next.js', 'Django'] },
          ],
        };
      case 'coursework':
        return {
          type: 'coursework' as const,
          id: genId(),
          title: 'Coursework Information',
          courses: ['Data Structures', 'Algorithms', 'Operating Systems', 'Machine Learning'],
        };
      case 'por':
        return {
          type: 'por' as const,
          id: genId(),
          title: 'Positions of Responsibility',
          entries: [
            {
              id: genId(),
              role: 'Role Title',
              organization: 'Organization Name',
              timeline: "May'23 - Apr'24",
              bullets: ['Describe your responsibilities and achievements'],
            },
          ],
        };
      case 'achievements':
        return {
          type: 'achievements' as const,
          id: genId(),
          title: 'Awards and Achievements',
          items: [
            { id: genId(), text: 'Add your achievement here' },
          ],
        };
      case 'eca':
        return {
          type: 'eca' as const,
          id: genId(),
          title: 'Extra Curricular Activities',
          items: ['Add your activity here'],
        };
      default:
        return {
          type: 'custom' as const,
          id: genId(),
          title: 'Custom Section',
          items: [{ id: genId(), text: 'Add content here' }],
        };
    }
  });

  return {
    id: genId(),
    title: title || `${template.name} Resume`,
    templateId,
    header: {
      name: 'Your Name',
      rollNumber: '00XX00000',
      institution: template.name,
      department: 'Computer Science and Engineering',
      degree: 'B.Tech',
      gender: '',
      dob: '',
      photo: '',
      links: [],
    },
    sections: defaultSections,
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: 1,
    },
  };
}
