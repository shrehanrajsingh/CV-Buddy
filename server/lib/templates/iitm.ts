import { CVTemplate } from '../schemas/template';

export const iitmTemplate: CVTemplate = {
  id: 'iitm',
  name: 'IIT Madras',
  description: 'IITM CV format — Varela Round, blue accent theme, left-aligned headings',
  logoPath: '/logos/iitm.png',

  typography: {
    fontFamily: "'Varela Round', sans-serif",
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Varela+Round&display=swap',
    baseFontSize: 14,
    headingSize: 20,
    subheadingSize: 14,
    nameSize: 32,
  },

  spacing: {
    pageMargin: '20mm',
    sectionGap: 16,
    itemGap: 0,
    bulletIndent: 13,
  },

  colors: {
    primary: '#0d8fcd',
    text: '#000000',
    headingText: '#0d8fcd',
    headingBg: null,
    border: '#0d8fcd',
    accent: '#0d8fcd',
    bulletColor: '#0d8fcd',
  },

  header: {
    layout: 'name-logo',
    showPhoto: false,
    showDOB: false,
    showGender: false,
    nameTransform: 'none',
  },

  sectionHeading: {
    alignment: 'left',
    textTransform: 'none',
    borderStyle: 'bottom-only',
    hasBackground: false,
  },

  defaultSectionOrder: ['education', 'achievements', 'projects', 'coursework', 'skills', 'por', 'eca'],

  educationTable: {
    columns: [
      { key: 'degree', label: 'Program' },
      { key: 'institution', label: 'Institution' },
      { key: 'score', label: '%/CGPA' },
      { key: 'year', label: 'Year' },
    ],
  },

  constraints: {
    maxPages: 2,
    allowCustomSections: true,
    requiredSections: ['education'],
  },
};
