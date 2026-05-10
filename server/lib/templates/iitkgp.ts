import { CVTemplate } from '../schemas/template';

export const iitkgpTemplate: CVTemplate = {
  id: 'iitkgp',
  name: 'IIT Kharagpur',
  description: 'Standard IITKGP placement CV — Open Sans, gray section headers, profile photo support',
  logoPath: '/logos/iitkgp.png',

  typography: {
    fontFamily: "'Open Sans', sans-serif",
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
    baseFontSize: 14,
    headingSize: 16,
    subheadingSize: 14,
    nameSize: 22,
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
    headingText: '#000000',
    headingBg: '#dce1e2',
    border: '#b7bece',
    accent: '#000000',
    bulletColor: '#000000',
  },

  header: {
    layout: 'logo-name-photo',
    showPhoto: true,
    showDOB: false,
    showGender: false,
    nameTransform: 'uppercase',
  },

  sectionHeading: {
    alignment: 'center',
    textTransform: 'uppercase',
    borderStyle: 'top-bottom',
    hasBackground: true,
  },

  defaultSectionOrder: ['education', 'projects', 'skills', 'coursework', 'por', 'achievements', 'eca'],

  educationTable: {
    columns: [
      { key: 'year', label: 'Year' },
      { key: 'degree', label: 'Degree/Exam' },
      { key: 'institution', label: 'Institute' },
      { key: 'score', label: 'CGPA/Percentage' },
    ],
  },

  constraints: {
    maxPages: 2,
    allowCustomSections: true,
    requiredSections: ['education'],
  },
};
