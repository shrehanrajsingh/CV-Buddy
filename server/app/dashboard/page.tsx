'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getAllTemplates } from '@/lib/templates/registry';
import type { TemplateId } from '@/lib/schemas/resume';
import ThemeToggle from '@/components/ThemeToggle';
import './dashboard.css';

const templates = getAllTemplates();

const badgeClass: Record<string, string> = {
  iitkgp: 'badgeIitkgp',
  iitb: 'badgeIitb',
  iitm: 'badgeIitm',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  const router = useRouter();
  const { resumes, createResume, duplicateResume, deleteResume } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTemplate, setNewTemplate] = useState<TemplateId>('iitkgp');

  function handleCreate() {
    const id = createResume(newTemplate, newTitle || undefined);
    setShowModal(false);
    setNewTitle('');
    router.push(`/editor/${id}`);
  }

  function handleQuickCreate(templateId: TemplateId) {
    const id = createResume(templateId);
    router.push(`/editor/${id}`);
  }

  function handleDuplicate(id: string) {
    duplicateResume(id);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this resume? This cannot be undone.')) {
      deleteResume(id);
    }
  }

  function handleExportJSON(id: string) {
    const resume = resumes.find(r => r.id === id);
    if (!resume) return;
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="logoSection">
          <div className="logoIcon">C</div>
          <div className="logoText">
            <h1>CV Studio</h1>
            <p>Built by <a href="https://shrehanrajsingh.dev" style={{ color: '#000', textDecoration: 'underline' }}>shrehanrajsingh</a></p>
          </div>
        </div>
        <div className="headerActions">
          <ThemeToggle />
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Resume
          </button>
        </div>
      </header>

      {/* Template Quick-Start */}
      <h2 className="sectionTitle">Quick Start — Choose a Template</h2>
      <div className="templateGrid">
        {templates.map((t) => (
          <div
            key={t.id}
            className="templateCard"
            onClick={() => handleQuickCreate(t.id)}
          >
            <span className={`templateBadge ${badgeClass[t.id]}`}>
              {t.id.toUpperCase()}
            </span>
            <h3>{t.name}</h3>
            <p>{t.description}</p>
            <div className="templateMeta">
              <span>{t.typography.fontFamily.split("'")[1] || t.typography.fontFamily}</span>
              <span>{t.sectionHeading.alignment} aligned</span>
              <span>{t.header.showPhoto ? 'With photo' : 'No photo'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Your Resumes */}
      <h2 className="sectionTitle">Your Resumes</h2>
      {resumes.length === 0 ? (
        <div className="emptyState">
          <div className="emptyIcon">+</div>
          <h3>No resumes yet</h3>
          <p>Click on a template above or use the &quot;New Resume&quot; button to get started.</p>
        </div>
      ) : (
        <div className="resumeGrid">
          {[...resumes].sort((a, b) =>
            new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime()
          ).map((resume) => (
            <div key={resume.id} className="resumeCard">
              <div
                className="resumePreview"
                onClick={() => router.push(`/editor/${resume.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="miniPreview">
                  <div className="miniPreviewLine" />
                  <div className="miniPreviewLine" />
                  <div className="miniPreviewLine" />
                  <div className="miniPreviewLine" />
                  <div className="miniPreviewLine" />
                  <div className="miniPreviewLine" />
                </div>
              </div>
              <div className="resumeInfo">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`templateBadge ${badgeClass[resume.templateId]}`}>
                    {resume.templateId.toUpperCase()}
                  </span>
                </div>
                <h3>{resume.title}</h3>
                <div className="resumeMeta">
                  <span className="resumeDate">
                    {formatDate(resume.metadata.updatedAt)} · v{resume.metadata.version}
                  </span>
                  <div className="resumeActions">
                    <button
                      className="actionBtn"
                      title="Edit"
                      onClick={() => router.push(`/editor/${resume.id}`)}
                    >Edit</button>
                    <button
                      className="actionBtn"
                      title="Duplicate"
                      onClick={() => handleDuplicate(resume.id)}
                    >Copy</button>
                    <button
                      className="actionBtn"
                      title="Export JSON"
                      onClick={() => handleExportJSON(resume.id)}
                    >Save</button>
                    <button
                      className="actionBtn danger"
                      title="Delete"
                      onClick={() => handleDelete(resume.id)}
                    >Del</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Resume</h2>
            <p>Choose a template and give your resume a name.</p>
            <div className="formGroup">
              <label htmlFor="resume-title">Resume Title</label>
              <input
                id="resume-title"
                type="text"
                placeholder="e.g., Placement Resume 2025"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="formGroup">
              <label htmlFor="resume-template">Template</label>
              <select
                id="resume-template"
                value={newTemplate}
                onChange={(e) => setNewTemplate(e.target.value as TemplateId)}
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="modalActions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                Create Resume
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '32px 0 16px',
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--text-muted)'
      }}>
        Made with &lt;3 by <a href="https://github.com/shrehanrajsingh" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>shrehanrajsingh</a>
      </footer>
    </div>
  );
}
