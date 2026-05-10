'use client';

import React from 'react';
import type { Resume, Section } from '@/lib/schemas/resume';
import { getTemplate } from '@/lib/templates/registry';
import type { CVTemplate } from '@/lib/schemas/template';

interface CVPreviewProps {
  resume: Resume;
}

// ── IITKGP Header ─────────────────────────────────
function IITKGPHeader({ resume, template }: { resume: Resume; template: CVTemplate }) {
  const { header } = resume;
  return (
    <div className="cvHeader">
      <div>
        <img className="cvLogo" src={template.logoPath} alt="Logo" />
      </div>
      <div className="cvHeaderCenter">
        <h1>
          <span className="cvName">{header.name}</span> | <span>{header.rollNumber}</span>
        </h1>
        <h2>{header.institution}</h2>
      </div>
      {template.header.showPhoto && header.photo && (
        <div>
          <img className="cvPhoto" src={header.photo} alt="Photo" />
        </div>
      )}
    </div>
  );
}

// ── IITB Header ───────────────────────────────────
function IITBHeader({ resume, template }: { resume: Resume; template: CVTemplate }) {
  const { header } = resume;
  return (
    <div className="cvHeader">
      <div>
        <img className="cvLogo" src={template.logoPath} alt="Logo" />
      </div>
      <div className="cvHeaderCenter">
        <h1>{header.name}</h1>
        <h2>{header.department}</h2>
        <h2>{header.institution}</h2>
      </div>
      <div className="cvHeaderRight">
        <h2>{header.rollNumber}</h2>
        <h2>{header.degree}</h2>
        {header.gender && <h2>{header.gender}</h2>}
        {header.dob && <h2>DOB: {header.dob}</h2>}
      </div>
    </div>
  );
}

// ── IITM Header ───────────────────────────────────
function IITMHeader({ resume, template }: { resume: Resume; template: CVTemplate }) {
  const { header } = resume;
  return (
    <div className="cvHeader">
      <div className="cvHeaderLeft">
        <h1>
          <span>{header.name}</span> | <span className="cvRoll">{header.rollNumber}</span>
        </h1>
        <h2>{header.institution}</h2>
      </div>
      <img className="cvLogo" src={template.logoPath} alt="Logo" />
    </div>
  );
}

// ── Section Renderers ─────────────────────────────

function renderSection(section: Section, template: CVTemplate) {
  switch (section.type) {
    case 'education':
      return (
        <div key={section.id}>
          <h1 className="cvSectionHeading">{section.title}</h1>
          <table className="cvTable">
            <thead>
              <tr>
                {template.educationTable.columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.entries.map((entry) => (
                <tr key={entry.id}>
                  {template.educationTable.columns.map((col) => (
                    <td key={col.key}>
                      {col.key === 'degree' ? entry.degree :
                       col.key === 'institution' ? entry.institution :
                       col.key === 'year' ? entry.year :
                       col.key === 'score' ? entry.score : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'projects':
      return (
        <div key={section.id}>
          <h1 className="cvSectionHeading">{section.title}</h1>
          {section.entries.map((entry) => (
            <ul className="cvList" key={entry.id}>
              <li className="cvEntryHeading">
                <span>
                  {entry.title}
                  {entry.timeline && <span className="cvTimeline">{entry.timeline}</span>}
                </span>
                {entry.supervisor && <span className="cvSupervisor">{entry.supervisor}</span>}
              </li>
              {entry.bullets.map((b, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
              ))}
              {entry.links && entry.links.map((link, i) => (
                <li key={`link-${i}`}>
                  Link: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label || link.url}</a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      );

    case 'skills':
      return (
        <div key={section.id}>
          <h1 className="cvSectionHeading">{section.title}</h1>
          <ul className="cvList">
            {section.categories.map((cat) => (
              <li key={cat.id}>
                <span className="cvSkillCategory">{cat.category}: </span>
                {cat.items.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      );

    case 'coursework': {
      const courses = section.courses;
      const half = Math.ceil(courses.length / 2);
      const col1 = courses.slice(0, half);
      const col2 = courses.slice(half);
      return (
        <div key={section.id}>
          <h1 className="cvSectionHeading">{section.title}</h1>
          <table className="cvCourseworkTable">
            <tbody>
              {col1.map((c, i) => (
                <tr key={i}>
                  <td>{c}</td>
                  {col2[i] !== undefined ? <td>{col2[i]}</td> : <td></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'por':
      return (
        <div key={section.id}>
          <h1 className="cvSectionHeading">{section.title}</h1>
          {section.entries.map((entry) => (
            <ul className="cvList" key={entry.id}>
              <li className="cvEntryHeading">
                <span>
                  {entry.role}
                  <span className="cvOrganization"> | {entry.organization}</span>
                </span>
                {entry.timeline && <span className="cvPorTimeline">{entry.timeline}</span>}
              </li>
              {entry.bullets.map((b, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
              ))}
            </ul>
          ))}
        </div>
      );

    case 'achievements':
      return (
        <div key={section.id}>
          <h1 className="cvSectionHeading">{section.title}</h1>
          <ul className="cvList">
            {section.items.map((item) => (
              <li key={item.id} dangerouslySetInnerHTML={{ __html: item.text }} />
            ))}
          </ul>
        </div>
      );

    case 'eca':
      return (
        <div key={section.id}>
          <h1 className="cvSectionHeading">{section.title}</h1>
          <ul className="cvList">
            {section.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>
      );

    case 'custom':
      return (
        <div key={section.id}>
          <h1 className="cvSectionHeading">{section.title}</h1>
          <ul className="cvList">
            {section.items.map((item) => (
              <li key={item.id} dangerouslySetInnerHTML={{ __html: item.text }} />
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

export default function CVPreview({ resume }: CVPreviewProps) {
  const template = getTemplate(resume.templateId);
  const tplClass = `cvRender tpl-${resume.templateId}`;

  const renderHeader = () => {
    switch (resume.templateId) {
      case 'iitb': return <IITBHeader resume={resume} template={template} />;
      case 'iitm': return <IITMHeader resume={resume} template={template} />;
      default: return <IITKGPHeader resume={resume} template={template} />;
    }
  };

  return (
    <div className={tplClass}>
      <link href={template.typography.fontImportUrl} rel="stylesheet" />
      {renderHeader()}
      {resume.sections.map((section) => renderSection(section, template))}
    </div>
  );
}
