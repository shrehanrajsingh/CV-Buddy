// ── Template Configuration Interface ───────────────

export interface CVTemplate {
  id: 'iitkgp' | 'iitb' | 'iitm';
  name: string;
  description: string;
  logoPath: string;

  typography: {
    fontFamily: string;
    fontImportUrl: string;
    baseFontSize: number;
    headingSize: number;
    subheadingSize: number;
    nameSize: number;
  };

  spacing: {
    pageMargin: string;
    sectionGap: number;
    itemGap: number;
    bulletIndent: number;
  };

  colors: {
    primary: string;
    text: string;
    headingText: string;
    headingBg: string | null;
    border: string;
    accent: string;
    bulletColor: string;
  };

  header: {
    layout: 'logo-name-photo' | 'logo-info-info' | 'name-logo';
    showPhoto: boolean;
    showDOB: boolean;
    showGender: boolean;
    nameTransform: 'uppercase' | 'none';
  };

  sectionHeading: {
    alignment: 'center' | 'left';
    textTransform: 'uppercase' | 'none';
    borderStyle: 'top-bottom' | 'bottom-only' | 'double';
    hasBackground: boolean;
  };

  defaultSectionOrder: string[];

  educationTable: {
    columns: Array<{ key: string; label: string }>;
  };

  constraints: {
    maxPages: number;
    allowCustomSections: boolean;
    requiredSections: string[];
  };
}
