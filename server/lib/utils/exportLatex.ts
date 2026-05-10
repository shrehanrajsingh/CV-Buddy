import type { Resume, Section } from '@/lib/schemas/resume';

// ── LaTeX escaping ────────────────────────────────
// Escapes raw text, then converts HTML formatting to LaTeX macros.
function esc(text: string): string {
  let t = text;

  // Escape LaTeX specials first
  t = t
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');

  // Convert HTML formatting to LaTeX (after escaping, so braces are safe)
  t = t
    .replace(/<b>(.*?)<\/b>/gi, '\\textbf{$1}')
    .replace(/<strong>(.*?)<\/strong>/gi, '\\textbf{$1}')
    .replace(/<i>(.*?)<\/i>/gi, '\\textit{$1}')
    .replace(/<em>(.*?)<\/em>/gi, '\\textit{$1}')
    .replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (_, url, label) => {
      const safeUrl = url.replace(/#/g, '\\#').replace(/%/g, '\\%');
      return `\\href{${safeUrl}}{${label}}`;
    })
    .replace(/<[^>]+>/g, '');

  return t;
}

// ── Section heading with gray background ──────────
function sectionBox(title: string): string {
  return `\\sectionheading{${esc(title)}}`;
}

// ── Section renderers ─────────────────────────────

function renderEducation(section: Extract<Section, { type: 'education' }>): string {
  const rows = section.entries
    .map(e => `    ${esc(e.year)} & ${esc(e.degree)} & ${esc(e.institution)} & ${esc(e.score)} \\\\`)
    .join('\n');

  return `
${sectionBox(section.title)}
\\begin{tabularx}{\\textwidth}{l X l l}
    \\textbf{Year} & \\textbf{Degree/Exam} & \\textbf{Institute} & \\textbf{CGPA/Percentage} \\\\
    \\hline
${rows}
\\end{tabularx}`;
}

function renderProjects(section: Extract<Section, { type: 'projects' }>): string {
  const entries = section.entries.map(e => {
    const supervisorPart = e.supervisor
      ? `\\hfill \\textit{${esc(e.supervisor)}}`
      : '';
    const timelinePart = e.timeline ? ` ${esc(e.timeline)}` : '';

    // Project heading line: bold title + timeline on left, supervisor on right
    const header = `\\projectheading{${esc(e.title)}${timelinePart}}{${supervisorPart}}`;

    const bullets = e.bullets
      .filter(b => b.trim())
      .map(b => `    \\item ${esc(b)}`)
      .join('\n');

    const links = (e.links || [])
      .map(l => {
        const safeUrl = l.url.replace(/#/g, '\\#').replace(/%/g, '\\%');
        return `    \\item Link: \\href{${safeUrl}}{${esc(l.label || l.url)}}`;
      })
      .join('\n');

    const itemBlock = [bullets, links].filter(Boolean).join('\n');

    return `${header}
\\begin{cvlist}
${itemBlock}
\\end{cvlist}`;
  }).join('\n');

  return `
${sectionBox(section.title)}
${entries}`;
}

function renderSkills(section: Extract<Section, { type: 'skills' }>): string {
  const items = section.categories
    .map(c => `    \\item \\textbf{${esc(c.category)}:} ${esc(c.items.join(', '))}`)
    .join('\n');

  return `
${sectionBox(section.title)}
\\begin{cvlist}
${items}
\\end{cvlist}`;
}

function renderCoursework(section: Extract<Section, { type: 'coursework' }>): string {
  const courses = section.courses.filter(c => c.trim());
  const half = Math.ceil(courses.length / 2);
  const col1 = courses.slice(0, half);
  const col2 = courses.slice(half);

  const rows = col1.map((c, i) => {
    const right = col2[i] ? `$\\circ$ ${esc(col2[i])}` : '';
    return `    $\\circ$ ${esc(c)} & ${right} \\\\`;
  }).join('\n');

  return `
${sectionBox(section.title)}
\\begin{tabularx}{\\textwidth}{X X}
${rows}
\\end{tabularx}`;
}

function renderPOR(section: Extract<Section, { type: 'por' }>): string {
  const entries = section.entries.map(e => {
    const timelinePart = e.timeline ? `\\hfill ${esc(e.timeline)}` : '';
    const header = `\\projectheading{${esc(e.role)} \\textnormal{| ${esc(e.organization)}}}{${timelinePart}}`;

    const bullets = e.bullets
      .filter(b => b.trim())
      .map(b => `    \\item ${esc(b)}`)
      .join('\n');

    return `${header}
\\begin{cvlist}
${bullets}
\\end{cvlist}`;
  }).join('\n');

  return `
${sectionBox(section.title)}
${entries}`;
}

function renderAchievements(section: Extract<Section, { type: 'achievements' }>): string {
  const items = section.items
    .filter(i => i.text.trim())
    .map(i => `    \\item ${esc(i.text)}`)
    .join('\n');

  return `
${sectionBox(section.title)}
\\begin{cvlist}
${items}
\\end{cvlist}`;
}

function renderECA(section: Extract<Section, { type: 'eca' }>): string {
  const items = section.items
    .filter(i => i.trim())
    .map(i => `    \\item ${esc(i)}`)
    .join('\n');

  return `
${sectionBox(section.title)}
\\begin{cvlist}
${items}
\\end{cvlist}`;
}

function renderCustom(section: Extract<Section, { type: 'custom' }>): string {
  const items = section.items
    .filter(i => i.text.trim())
    .map(i => `    \\item ${esc(i.text)}`)
    .join('\n');

  return `
${sectionBox(section.title)}
\\begin{cvlist}
${items}
\\end{cvlist}`;
}

function renderSection(section: Section): string {
  switch (section.type) {
    case 'education': return renderEducation(section);
    case 'projects': return renderProjects(section);
    case 'skills': return renderSkills(section);
    case 'coursework': return renderCoursework(section);
    case 'por': return renderPOR(section);
    case 'achievements': return renderAchievements(section);
    case 'eca': return renderECA(section);
    case 'custom': return renderCustom(section);
    default: return '';
  }
}

// ── Main export ───────────────────────────────────
export function resumeToLatex(resume: Resume): string {
  const { header } = resume;
  const sections = resume.sections.map(renderSection).join('\n');

  const nameLine = header.rollNumber
    ? `\\MakeUppercase{${esc(header.name)}} | ${esc(header.rollNumber)}`
    : `\\MakeUppercase{${esc(header.name)}}`;

  // Determine logo path based on template
  let logoComment = '';
  switch (resume.templateId) {
    case 'iitkgp':
      logoComment = '% Place kgp-logo.png in the same directory as this .tex file\n\\def\\logofile{kgp-logo.png}';
      break;
    case 'iitb':
      logoComment = '% Place iitb-logo.png in the same directory as this .tex file\n\\def\\logofile{iitb-logo.png}';
      break;
    case 'iitm':
      logoComment = '% Place iitm-logo.png in the same directory as this .tex file\n\\def\\logofile{iitm-logo.png}';
      break;
  }

  return `\\documentclass[a4paper,11pt]{article}

%% ---- Packages ----
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[top=0.3in, bottom=0.3in, left=0.25in, right=0.25in]{geometry}
\\usepackage{opensans}
\\renewcommand{\\familydefault}{\\sfdefault}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{tabularx}
\\usepackage{graphicx}
\\usepackage{colortbl}
\\usepackage{titlesec}
\\usepackage{calc}

%% ---- Colors (matching IITKGP template) ----
\\definecolor{sectionbg}{HTML}{DCE1E2}
\\definecolor{sectionborder}{HTML}{B7BECE}

%% ---- Section heading command ----
%% Gray background, centered, uppercase, bold, with top/bottom border lines
\\newcommand{\\sectionheading}[1]{%
    \\vspace{6pt}%
    {\\color{sectionborder}\\hrule height 0.5pt}%
    \\vspace{-0.5pt}%
    \\colorbox{sectionbg}{%
        \\parbox{\\dimexpr\\textwidth-2\\fboxsep}{%
            \\centering\\bfseries\\large\\MakeUppercase{#1}%
        }%
    }%
    \\vspace{-1pt}%
    {\\color{sectionborder}\\hrule height 0.5pt}%
    \\vspace{3pt}%
}

%% ---- Project / POR heading command ----
%% Bold title on left, supervisor/timeline on right, no bullet
\\newcommand{\\projectheading}[2]{%
    \\noindent\\textbf{#1} #2\\par%
}

%% ---- CV list environment (circle markers, compact) ----
\\newlist{cvlist}{itemize}{1}
\\setlist[cvlist]{
    label=$\\circ$,
    leftmargin=1.2em,
    itemsep=0pt,
    parsep=0pt,
    topsep=1pt,
    partopsep=0pt
}

%% ---- Hyperlinks ----
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=black
}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}

${logoComment}

\\begin{document}

%% ---- Header ----
\\begin{minipage}[t]{0.12\\textwidth}
    \\vspace{0pt}
    \\IfFileExists{\\logofile}{%
        \\includegraphics[width=\\linewidth]{\\logofile}%
    }{%
        % Logo file not found — leave blank
    }
\\end{minipage}%
\\hfill
\\begin{minipage}[t]{0.76\\textwidth}
    \\vspace{0pt}
    \\centering
    {\\LARGE\\bfseries ${nameLine}}\\\\[2pt]
    {\\large ${esc(header.institution)}}
\\end{minipage}%
\\hfill
\\begin{minipage}[t]{0.12\\textwidth}
    \\vspace{0pt}
    % Right side placeholder (profile photo or empty)
\\end{minipage}
${sections}

\\end{document}
`;
}
