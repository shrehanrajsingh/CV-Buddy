import { CVTemplate } from '../schemas/template';

export const iitbTemplate: CVTemplate = {
  id: 'iitb',
  name: 'IIT Bombay',
  description: 'IITB placement CV — EB Garamond serif, double-border headers, no photo',
  logoPath: '/logos/iitb.png',

  typography: {
    fontFamily: "'EB Garamond', serif",
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap',
    baseFontSize: 14,
    headingSize: 15,
    subheadingSize: 14,
    nameSize: 16,
  },

  spacing: {
    pageMargin: '15mm',
    sectionGap: 8,
    itemGap: 0,
    bulletIndent: 13,
  },

  colors: {
    primary: '#000000',
    text: '#000000',
    headingText: '#292929',
    headingBg: null,
    border: '#707070',
    accent: '#000000',
    bulletColor: '#000000',
  },

  header: {
    layout: 'logo-info-info',
    showPhoto: false,
    showDOB: true,
    showGender: true,
    nameTransform: 'none',
  },

  sectionHeading: {
    alignment: 'center',
    textTransform: 'uppercase',
    borderStyle: 'double',
    hasBackground: false,
  },

  defaultSectionOrder: ['education', 'achievements', 'projects', 'por', 'skills', 'coursework', 'eca'],

  educationTable: {
    columns: [
      { key: 'degree', label: 'Examination' },
      { key: 'institution', label: 'Institute' },
      { key: 'year', label: 'Year' },
      { key: 'score', label: 'CGPA / %' },
    ],
  },

  constraints: {
    maxPages: 2,
    allowCustomSections: true,
    requiredSections: ['education'],
  },
};
