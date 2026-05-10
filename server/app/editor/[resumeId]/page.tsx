'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getTemplate, getAllTemplates } from '@/lib/templates/registry';
import type { Resume, Section, TemplateId } from '@/lib/schemas/resume';
import CVPreview from '@/components/editor/CVPreview';
import SectionEditor from '@/components/editor/SectionEditor';
import HeaderEditor from '@/components/editor/HeaderEditor';
import ThemeToggle from '@/components/ThemeToggle';
import { resumeToLatex } from '@/lib/utils/exportLatex';
import '../editor.css';
import '../cv-render.css';

const SECTION_TYPES = [
  { type: 'education', label: 'Education' },
  { type: 'projects', label: 'Projects' },
  { type: 'skills', label: 'Skills' },
  { type: 'coursework', label: 'Coursework' },
  { type: 'por', label: 'Positions of Responsibility' },
  { type: 'achievements', label: 'Achievements' },
  { type: 'eca', label: 'Extra Curricular' },
  { type: 'custom', label: 'Custom Section' },
];

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;

  const {
    resumes, updateHeader, replaceSection, updateSectionTitle,
    addSection, removeSection, reorderSections, updateResumeTitle,
    changeTemplate,
  } = useAppStore();

  const [mounted, setMounted] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const resume = resumes.find((r) => r.id === resumeId);

  const handleExportJSON = useCallback(() => {
    if (!resume) return;
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [resume]);

  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as Resume;
          // Apply imported data to current resume
          if (data.header) updateHeader(resumeId, data.header);
          if (data.sections) {
            data.sections.forEach((sec, i) => {
              if (resume && i < resume.sections.length) {
                replaceSection(resumeId, resume.sections[i].id, sec);
              } else {
                addSection(resumeId, sec.type);
              }
            });
          }
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [resume, resumeId, updateHeader, replaceSection, addSection]);

  if (!mounted) {
    return (
      <div className="editorLayout">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="editorLayout">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Resume not found</p>
          <button className="btn btn-primary" onClick={() => router.push('/dashboard')}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const template = getTemplate(resume.templateId);
  const allTemplates = getAllTemplates();

  return (
    <div className="editorLayout">
      {/* ── Top Bar ─────────────────────────────── */}
      <div className="topBar">
        <div className="topBarLeft">
          <button className="backBtn" onClick={() => router.push('/dashboard')}>← Back</button>
          <input
            className="resumeTitleInput"
            value={resume.title}
            onChange={(e) => updateResumeTitle(resumeId, e.target.value)}
          />
        </div>

        <div className="topBarCenter">
          {allTemplates.map((t) => (
            <button
              key={t.id}
              className={`templateTab ${resume.templateId === t.id ? 'active' : ''}`}
              onClick={() => changeTemplate(resumeId, t.id)}
            >
              {t.id.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="topBarRight">
          <span className="saveIndicator">
            <span className="saveDot" />
            Auto-saved · v{resume.metadata.version}
          </span>
          <ThemeToggle />
          <button className="btn btn-secondary btn-sm" onClick={handleImportJSON}>
            Import
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportJSON}>
            JSON
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => {
            if (!resume) return;
            const tex = resumeToLatex(resume);
            const blob = new Blob([tex], { type: 'application/x-tex' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resume.title.replace(/\s+/g, '_')}.tex`;
            a.click();
            URL.revokeObjectURL(url);
          }}>
            LaTeX
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => {
            const cvEl = document.querySelector('.a4Container');
            if (!cvEl) return;
            const printWin = window.open('', '_blank', 'width=800,height=1000');
            if (!printWin) return;
            // Collect all stylesheets from current page
            const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
              .map(el => el.outerHTML).join('\n');
            printWin.document.write(`<!DOCTYPE html>
<html><head>${styles}
<style>
@page { size: A4; margin: 5mm; }
html, body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head><body>${cvEl.innerHTML}</body></html>`);
            printWin.document.close();
            printWin.onload = () => { printWin.print(); printWin.close(); };
          }}>
            Export PDF
          </button>
        </div>
      </div>

      {/* ── Main Content ────────────────────────── */}
      <div className="mainContent">
        {/* ── Editor Pane ────────────────────────── */}
        <div className="editorPane">
          <HeaderEditor
            header={resume.header}
            template={template}
            onChange={(updates) => updateHeader(resumeId, updates)}
          />

          {resume.sections.map((section, idx) => (
            <SectionEditor
              key={section.id}
              section={section}
              onChange={(updated) => replaceSection(resumeId, section.id, updated)}
              onRemove={() => removeSection(resumeId, section.id)}
              onTitleChange={(title) => updateSectionTitle(resumeId, section.id, title)}
            />
          ))}

          {/* Add Section */}
          <div className="addSectionArea" style={{ position: 'relative' }}>
            <button className="addSectionBtn" onClick={() => setShowAddMenu(!showAddMenu)}>
              + Add Section
            </button>
            {showAddMenu && (
              <div className="addSectionDropdown" style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                {SECTION_TYPES.map((st) => (
                  <button
                    key={st.type}
                    className="addSectionOption"
                    onClick={() => {
                      addSection(resumeId, st.type);
                      setShowAddMenu(false);
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Preview Pane ───────────────────────── */}
        <div className="previewPane">
          <div className="a4Container">
            <CVPreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
