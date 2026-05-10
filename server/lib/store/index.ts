'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Resume, Section, Header, TemplateId } from '../schemas/resume';
import { createDefaultResume } from './defaults';
import { genId } from '../utils/id';

// ── Store for managing ALL resumes (dashboard-level) ──

interface AppStore {
  resumes: Resume[];
  activeResumeId: string | null;

  // Dashboard actions
  createResume: (templateId: TemplateId, title?: string) => string;
  duplicateResume: (id: string) => string | null;
  deleteResume: (id: string) => void;
  setActiveResume: (id: string | null) => void;
  getResume: (id: string) => Resume | undefined;

  // Resume editing actions
  updateHeader: (resumeId: string, updates: Partial<Header>) => void;
  updateSection: (resumeId: string, sectionId: string, updates: Partial<Section>) => void;
  updateSectionTitle: (resumeId: string, sectionId: string, title: string) => void;
  addSection: (resumeId: string, type: string, afterIndex?: number) => void;
  removeSection: (resumeId: string, sectionId: string) => void;
  reorderSections: (resumeId: string, fromIndex: number, toIndex: number) => void;
  replaceSection: (resumeId: string, sectionId: string, section: Section) => void;
  updateResumeTitle: (resumeId: string, title: string) => void;
  changeTemplate: (resumeId: string, templateId: TemplateId) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    immer((set, get) => ({
      resumes: [],
      activeResumeId: null,

      createResume: (templateId, title) => {
        const resume = createDefaultResume(templateId, title);
        set((s) => { s.resumes.push(resume); });
        return resume.id;
      },

      duplicateResume: (id) => {
        const original = get().resumes.find((r) => r.id === id);
        if (!original) return null;
        const now = new Date().toISOString();
        const dup: Resume = {
          ...JSON.parse(JSON.stringify(original)),
          id: genId(),
          title: `${original.title} (Copy)`,
          metadata: { createdAt: now, updatedAt: now, version: 1 },
        };
        set((s) => { s.resumes.push(dup); });
        return dup.id;
      },

      deleteResume: (id) => {
        set((s) => {
          s.resumes = s.resumes.filter((r) => r.id !== id);
          if (s.activeResumeId === id) s.activeResumeId = null;
        });
      },

      setActiveResume: (id) => {
        set((s) => { s.activeResumeId = id; });
      },

      getResume: (id) => {
        return get().resumes.find((r) => r.id === id);
      },

      updateHeader: (resumeId, updates) => {
        set((s) => {
          const r = s.resumes.find((r) => r.id === resumeId);
          if (r) {
            Object.assign(r.header, updates);
            r.metadata.updatedAt = new Date().toISOString();
            r.metadata.version++;
          }
        });
      },

      updateSection: (resumeId, sectionId, updates) => {
        set((s) => {
          const r = s.resumes.find((r) => r.id === resumeId);
          if (!r) return;
          const idx = r.sections.findIndex((sec) => sec.id === sectionId);
          if (idx === -1) return;
          Object.assign(r.sections[idx], updates);
          r.metadata.updatedAt = new Date().toISOString();
          r.metadata.version++;
        });
      },

      updateSectionTitle: (resumeId, sectionId, title) => {
        set((s) => {
          const r = s.resumes.find((r) => r.id === resumeId);
          if (!r) return;
          const sec = r.sections.find((sec) => sec.id === sectionId);
          if (sec) {
            sec.title = title;
            r.metadata.updatedAt = new Date().toISOString();
          }
        });
      },

      replaceSection: (resumeId, sectionId, section) => {
        set((s) => {
          const r = s.resumes.find((r) => r.id === resumeId);
          if (!r) return;
          const idx = r.sections.findIndex((sec) => sec.id === sectionId);
          if (idx !== -1) {
            r.sections[idx] = section;
            r.metadata.updatedAt = new Date().toISOString();
            r.metadata.version++;
          }
        });
      },

      addSection: (resumeId, type, afterIndex) => {
        set((s) => {
          const r = s.resumes.find((r) => r.id === resumeId);
          if (!r) return;
          let newSection: Section;
          const id = genId();
          switch (type) {
            case 'education':
              newSection = { type: 'education', id, title: 'Education', entries: [] };
              break;
            case 'projects':
              newSection = { type: 'projects', id, title: 'Projects', entries: [] };
              break;
            case 'skills':
              newSection = { type: 'skills', id, title: 'Skills', categories: [] };
              break;
            case 'coursework':
              newSection = { type: 'coursework', id, title: 'Coursework', courses: [] };
              break;
            case 'por':
              newSection = { type: 'por', id, title: 'Positions of Responsibility', entries: [] };
              break;
            case 'achievements':
              newSection = { type: 'achievements', id, title: 'Achievements', items: [] };
              break;
            case 'eca':
              newSection = { type: 'eca', id, title: 'Extra Curricular Activities', items: [] };
              break;
            default:
              newSection = { type: 'custom', id, title: 'Custom Section', items: [] };
          }
          const insertAt = afterIndex !== undefined ? afterIndex + 1 : r.sections.length;
          r.sections.splice(insertAt, 0, newSection);
          r.metadata.updatedAt = new Date().toISOString();
        });
      },

      removeSection: (resumeId, sectionId) => {
        set((s) => {
          const r = s.resumes.find((r) => r.id === resumeId);
          if (!r) return;
          r.sections = r.sections.filter((sec) => sec.id !== sectionId);
          r.metadata.updatedAt = new Date().toISOString();
        });
      },

      reorderSections: (resumeId, fromIndex, toIndex) => {
        set((s) => {
          const r = s.resumes.find((r) => r.id === resumeId);
          if (!r) return;
          const [moved] = r.sections.splice(fromIndex, 1);
          r.sections.splice(toIndex, 0, moved);
          r.metadata.updatedAt = new Date().toISOString();
        });
      },

      updateResumeTitle: (resumeId, title) => {
        set((s) => {
          const r = s.resumes.find((r) => r.id === resumeId);
          if (r) {
            r.title = title;
            r.metadata.updatedAt = new Date().toISOString();
          }
        });
      },

      changeTemplate: (resumeId, templateId) => {
        set((s) => {
          const r = s.resumes.find((r) => r.id === resumeId);
          if (r) {
            r.templateId = templateId;
            r.metadata.updatedAt = new Date().toISOString();
          }
        });
      },
    })),
    {
      name: 'cv-studio-storage',
    }
  )
);
