'use client';

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {
  Section, EducationSection, ProjectsSection, SkillsSection,
  CourseworkSection, PORSection, AchievementsSection, ECASection,
  CustomSection
} from '@/lib/schemas/resume';
import { genId } from '@/lib/utils/id';

const htmlHintStyle: React.CSSProperties = { fontSize: 10, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 };

function HtmlHint() {
  return (
    <p style={htmlHintStyle}>
      HTML supported: <code style={{ fontSize: 10, background: 'var(--bg-card)', padding: '1px 3px', borderRadius: 2 }}>&lt;b&gt;bold&lt;/b&gt;</code>{' '}
      <code style={{ fontSize: 10, background: 'var(--bg-card)', padding: '1px 3px', borderRadius: 2 }}>&lt;i&gt;italic&lt;/i&gt;</code>{' '}
      <code style={{ fontSize: 10, background: 'var(--bg-card)', padding: '1px 3px', borderRadius: 2 }}>&lt;a href="..."&gt;link&lt;/a&gt;</code>
    </p>
  );
}

interface SectionEditorProps {
  section: Section;
  onChange: (updated: Section) => void;
  onRemove: () => void;
  onTitleChange: (title: string) => void;
}

// ── Education ──────────────────────────────────────
function EducationEditor({ section, onChange }: { section: EducationSection; onChange: (s: EducationSection) => void }) {
  const update = (idx: number, field: string, value: string) => {
    const entries = [...section.entries];
    entries[idx] = { ...entries[idx], [field]: value };
    onChange({ ...section, entries });
  };
  const add = () => {
    onChange({ ...section, entries: [...section.entries, { id: genId(), degree: '', institution: '', year: '', score: '', scoreType: 'cgpa' }] });
  };
  const remove = (idx: number) => {
    onChange({ ...section, entries: section.entries.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      {section.entries.map((entry, idx) => (
        <div className="entryCard" key={entry.id}>
          <div className="entryRow">
            <div className="entryField">
              <label>Degree / Exam</label>
              <input value={entry.degree} onChange={(e) => update(idx, 'degree', e.target.value)} placeholder="B.Tech, CSE" />
            </div>
            <div className="entryField">
              <label>Year</label>
              <input value={entry.year} onChange={(e) => update(idx, 'year', e.target.value)} placeholder="2025" />
            </div>
          </div>
          <div className="entryRow">
            <div className="entryField">
              <label>Institute</label>
              <input value={entry.institution} onChange={(e) => update(idx, 'institution', e.target.value)} placeholder="IIT Kharagpur" />
            </div>
            <div className="entryField">
              <label>CGPA / %</label>
              <input value={entry.score} onChange={(e) => update(idx, 'score', e.target.value)} placeholder="9.0" />
            </div>
          </div>
          <button className="btn-ghost btn-sm removeBulletBtn" onClick={() => remove(idx)} style={{ marginTop: 4, color: 'var(--danger)' }}>Remove</button>
        </div>
      ))}
      <button className="addBtn" onClick={add}>+ Add Education</button>
    </div>
  );
}

// ── Projects ───────────────────────────────────────
function SortableProjectCard({ id, children }: { id: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function ProjectsEditor({ section, onChange }: { section: ProjectsSection; onChange: (s: ProjectsSection) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = section.entries.findIndex(e => e.id === active.id);
      const newIndex = section.entries.findIndex(e => e.id === over.id);
      onChange({ ...section, entries: arrayMove(section.entries, oldIndex, newIndex) });
    }
  };

  const updateEntry = (idx: number, field: string, value: string) => {
    const entries = [...section.entries];
    entries[idx] = { ...entries[idx], [field]: value };
    onChange({ ...section, entries });
  };
  const updateBullet = (eIdx: number, bIdx: number, value: string) => {
    const entries = [...section.entries];
    const bullets = [...entries[eIdx].bullets];
    bullets[bIdx] = value;
    entries[eIdx] = { ...entries[eIdx], bullets };
    onChange({ ...section, entries });
  };
  const addBullet = (eIdx: number) => {
    const entries = [...section.entries];
    entries[eIdx] = { ...entries[eIdx], bullets: [...entries[eIdx].bullets, ''] };
    onChange({ ...section, entries });
  };
  const removeBullet = (eIdx: number, bIdx: number) => {
    const entries = [...section.entries];
    entries[eIdx] = { ...entries[eIdx], bullets: entries[eIdx].bullets.filter((_, i) => i !== bIdx) };
    onChange({ ...section, entries });
  };
  const addEntry = () => {
    onChange({ ...section, entries: [...section.entries, { id: genId(), title: '', timeline: '', supervisor: '', bullets: [''], links: [] }] });
  };
  const removeEntry = (idx: number) => {
    onChange({ ...section, entries: section.entries.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={section.entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          {section.entries.map((entry, eIdx) => (
            <SortableProjectCard key={entry.id} id={entry.id}>
              <div className="entryCard" onKeyDown={(e) => e.stopPropagation()}>
                <div className="entryRow">
                  <div className="entryField">
                    <label>Project Title</label>
                    <input value={entry.title} onChange={(e) => updateEntry(eIdx, 'title', e.target.value)} onPointerDown={(e) => e.stopPropagation()} />
                  </div>
                  <div className="entryField">
                    <label>Timeline</label>
                    <input value={entry.timeline || ''} onChange={(e) => updateEntry(eIdx, 'timeline', e.target.value)} placeholder="May'24 - Jul'24" onPointerDown={(e) => e.stopPropagation()} />
                  </div>
                </div>
                <div className="entryRow">
                  <div className="entryField">
                    <label>Supervisor</label>
                    <input value={entry.supervisor || ''} onChange={(e) => updateEntry(eIdx, 'supervisor', e.target.value)} placeholder="Prof. Name" onPointerDown={(e) => e.stopPropagation()} />
                  </div>
                </div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4, display: 'block' }}>Bullet Points</label>
                <ul className="bulletList">
                  {entry.bullets.map((b, bIdx) => (
                    <li className="bulletItem" key={bIdx}>
                      <span className="bulletMarker">○</span>
                      <input className="bulletInput" value={b} onChange={(e) => updateBullet(eIdx, bIdx, e.target.value)} placeholder="Describe your work..." onPointerDown={(e) => e.stopPropagation()} />
                      <button className="removeBulletBtn" onClick={() => removeBullet(eIdx, bIdx)} onPointerDown={(e) => e.stopPropagation()}>✕</button>
                    </li>
                  ))}
                </ul>
                <button className="addBtn" onClick={() => addBullet(eIdx)} onPointerDown={(e) => e.stopPropagation()}>+ Add Bullet</button>
                <HtmlHint />
                <button className="btn-ghost btn-sm removeBulletBtn" onClick={() => removeEntry(eIdx)} style={{ marginTop: 4, color: 'var(--danger)' }} onPointerDown={(e) => e.stopPropagation()}>Remove Project</button>
              </div>
            </SortableProjectCard>
          ))}
        </SortableContext>
      </DndContext>
      <button className="addBtn" onClick={addEntry}>+ Add Project</button>
    </div>
  );
}

// ── Skills ─────────────────────────────────────────
function SkillsEditor({ section, onChange }: { section: SkillsSection; onChange: (s: SkillsSection) => void }) {
  const updateCategory = (idx: number, field: string, value: string) => {
    const cats = [...section.categories];
    cats[idx] = { ...cats[idx], [field]: value };
    onChange({ ...section, categories: cats });
  };
  const updateItems = (idx: number, value: string) => {
    const cats = [...section.categories];
    cats[idx] = { ...cats[idx], items: value.split(',').map(s => s.trim()) };
    onChange({ ...section, categories: cats });
  };
  const addCategory = () => {
    onChange({ ...section, categories: [...section.categories, { id: genId(), category: '', items: [] }] });
  };
  const removeCategory = (idx: number) => {
    onChange({ ...section, categories: section.categories.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      {section.categories.map((cat, idx) => (
        <div className="entryCard" key={cat.id}>
          <div className="entryRow">
            <div className="entryField">
              <label>Category</label>
              <input value={cat.category} onChange={(e) => updateCategory(idx, 'category', e.target.value)} placeholder="Programming Languages" />
            </div>
          </div>
          <div className="entryRow">
            <div className="entryField">
              <label>Items (comma separated)</label>
              <input value={cat.items.join(', ')} onChange={(e) => updateItems(idx, e.target.value)} placeholder="Python, C++, JavaScript" />
            </div>
          </div>
          <button className="btn-ghost btn-sm removeBulletBtn" onClick={() => removeCategory(idx)} style={{ color: 'var(--danger)' }}>Remove</button>
        </div>
      ))}
      <button className="addBtn" onClick={addCategory}>+ Add Category</button>
    </div>
  );
}

// ── Coursework ─────────────────────────────────────
function CourseworkEditor({ section, onChange }: { section: CourseworkSection; onChange: (s: CourseworkSection) => void }) {
  const update = (idx: number, value: string) => {
    const courses = [...section.courses];
    courses[idx] = value;
    onChange({ ...section, courses });
  };
  const add = () => onChange({ ...section, courses: [...section.courses, ''] });
  const remove = (idx: number) => onChange({ ...section, courses: section.courses.filter((_, i) => i !== idx) });

  return (
    <div>
      <div className="coursesGrid">
        {section.courses.map((c, idx) => (
          <div className="courseItem" key={idx}>
            <input value={c} onChange={(e) => update(idx, e.target.value)} placeholder="Course name" />
            <button onClick={() => remove(idx)}>✕</button>
          </div>
        ))}
      </div>
      <button className="addBtn" onClick={add}>+ Add Course</button>
    </div>
  );
}

// ── POR ────────────────────────────────────────────
function POREditor({ section, onChange }: { section: PORSection; onChange: (s: PORSection) => void }) {
  const updateEntry = (idx: number, field: string, value: string) => {
    const entries = [...section.entries];
    entries[idx] = { ...entries[idx], [field]: value };
    onChange({ ...section, entries });
  };
  const updateBullet = (eIdx: number, bIdx: number, value: string) => {
    const entries = [...section.entries];
    const bullets = [...entries[eIdx].bullets];
    bullets[bIdx] = value;
    entries[eIdx] = { ...entries[eIdx], bullets };
    onChange({ ...section, entries });
  };
  const addBullet = (eIdx: number) => {
    const entries = [...section.entries];
    entries[eIdx] = { ...entries[eIdx], bullets: [...entries[eIdx].bullets, ''] };
    onChange({ ...section, entries });
  };
  const removeBullet = (eIdx: number, bIdx: number) => {
    const entries = [...section.entries];
    entries[eIdx] = { ...entries[eIdx], bullets: entries[eIdx].bullets.filter((_, i) => i !== bIdx) };
    onChange({ ...section, entries });
  };
  const addEntry = () => {
    onChange({ ...section, entries: [...section.entries, { id: genId(), role: '', organization: '', timeline: '', bullets: [''] }] });
  };
  const removeEntry = (idx: number) => {
    onChange({ ...section, entries: section.entries.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      {section.entries.map((entry, eIdx) => (
        <div className="entryCard" key={entry.id}>
          <div className="entryRow">
            <div className="entryField">
              <label>Role</label>
              <input value={entry.role} onChange={(e) => updateEntry(eIdx, 'role', e.target.value)} />
            </div>
            <div className="entryField">
              <label>Organization</label>
              <input value={entry.organization} onChange={(e) => updateEntry(eIdx, 'organization', e.target.value)} />
            </div>
          </div>
          <div className="entryRow">
            <div className="entryField">
              <label>Timeline</label>
              <input value={entry.timeline || ''} onChange={(e) => updateEntry(eIdx, 'timeline', e.target.value)} placeholder="May'23 - Apr'24" />
            </div>
          </div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4, display: 'block' }}>Bullet Points</label>
          <ul className="bulletList">
            {entry.bullets.map((b, bIdx) => (
              <li className="bulletItem" key={bIdx}>
                <span className="bulletMarker">○</span>
                <input className="bulletInput" value={b} onChange={(e) => updateBullet(eIdx, bIdx, e.target.value)} />
                <button className="removeBulletBtn" onClick={() => removeBullet(eIdx, bIdx)}>✕</button>
              </li>
            ))}
          </ul>
          <button className="addBtn" onClick={() => addBullet(eIdx)}>+ Add Bullet</button>
          <HtmlHint />
          <button className="btn-ghost btn-sm removeBulletBtn" onClick={() => removeEntry(eIdx)} style={{ marginTop: 4, color: 'var(--danger)' }}>Remove</button>
        </div>
      ))}
      <button className="addBtn" onClick={addEntry}>+ Add Position</button>
    </div>
  );
}

// ── Achievements ───────────────────────────────────
function AchievementsEditor({ section, onChange }: { section: AchievementsSection; onChange: (s: AchievementsSection) => void }) {
  const update = (idx: number, value: string) => {
    const items = [...section.items];
    items[idx] = { ...items[idx], text: value };
    onChange({ ...section, items });
  };
  const add = () => onChange({ ...section, items: [...section.items, { id: genId(), text: '' }] });
  const remove = (idx: number) => onChange({ ...section, items: section.items.filter((_, i) => i !== idx) });

  return (
    <div>
      <ul className="bulletList">
        {section.items.map((item, idx) => (
          <li className="bulletItem" key={item.id}>
            <span className="bulletMarker">○</span>
            <input className="bulletInput" value={item.text} onChange={(e) => update(idx, e.target.value)} placeholder="Describe achievement..." />
            <button className="removeBulletBtn" onClick={() => remove(idx)}>✕</button>
          </li>
        ))}
      </ul>
      <button className="addBtn" onClick={add}>+ Add Achievement</button>
      <HtmlHint />
    </div>
  );
}

// ── ECA ────────────────────────────────────────────
function ECAEditor({ section, onChange }: { section: ECASection; onChange: (s: ECASection) => void }) {
  const update = (idx: number, value: string) => {
    const items = [...section.items];
    items[idx] = value;
    onChange({ ...section, items });
  };
  const add = () => onChange({ ...section, items: [...section.items, ''] });
  const remove = (idx: number) => onChange({ ...section, items: section.items.filter((_, i) => i !== idx) });

  return (
    <div>
      <ul className="bulletList">
        {section.items.map((item, idx) => (
          <li className="bulletItem" key={idx}>
            <span className="bulletMarker">○</span>
            <input className="bulletInput" value={item} onChange={(e) => update(idx, e.target.value)} placeholder="Activity..." />
            <button className="removeBulletBtn" onClick={() => remove(idx)}>✕</button>
          </li>
        ))}
      </ul>
      <button className="addBtn" onClick={add}>+ Add Activity</button>
      <HtmlHint />
    </div>
  );
}

// ── Custom ─────────────────────────────────────────
function CustomEditor({ section, onChange }: { section: CustomSection; onChange: (s: CustomSection) => void }) {
  const update = (idx: number, value: string) => {
    const items = [...section.items];
    items[idx] = { ...items[idx], text: value };
    onChange({ ...section, items });
  };
  const add = () => onChange({ ...section, items: [...section.items, { id: genId(), text: '' }] });
  const remove = (idx: number) => onChange({ ...section, items: section.items.filter((_, i) => i !== idx) });

  return (
    <div>
      <ul className="bulletList">
        {section.items.map((item, idx) => (
          <li className="bulletItem" key={item.id}>
            <span className="bulletMarker">○</span>
            <input className="bulletInput" value={item.text} onChange={(e) => update(idx, e.target.value)} />
            <button className="removeBulletBtn" onClick={() => remove(idx)}>✕</button>
          </li>
        ))}
      </ul>
      <button className="addBtn" onClick={add}>+ Add Item</button>
      <HtmlHint />
    </div>
  );
}

// ── Main Section Editor Component ──────────────────
export default function SectionEditor({ section, onChange, onRemove, onTitleChange }: SectionEditorProps) {
  const renderEditor = () => {
    switch (section.type) {
      case 'education': return <EducationEditor section={section} onChange={onChange as (s: EducationSection) => void} />;
      case 'projects': return <ProjectsEditor section={section} onChange={onChange as (s: ProjectsSection) => void} />;
      case 'skills': return <SkillsEditor section={section} onChange={onChange as (s: SkillsSection) => void} />;
      case 'coursework': return <CourseworkEditor section={section} onChange={onChange as (s: CourseworkSection) => void} />;
      case 'por': return <POREditor section={section} onChange={onChange as (s: PORSection) => void} />;
      case 'achievements': return <AchievementsEditor section={section} onChange={onChange as (s: AchievementsSection) => void} />;
      case 'eca': return <ECAEditor section={section} onChange={onChange as (s: ECASection) => void} />;
      case 'custom': return <CustomEditor section={section} onChange={onChange as (s: CustomSection) => void} />;
      default: return <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Unknown section type</p>;
    }
  };

  return (
    <div className="sectionEditor">
      <div className="sectionEditorHeader">
        <div className="sectionHeaderLeft">
          <span className="dragHandle">⠿</span>
          <span className="sectionTypeTag">{section.type}</span>
          <input
            className="sectionTitleInput"
            value={section.title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        <div className="sectionHeaderRight">
          <button className="btn-icon" title="Remove section" onClick={onRemove} style={{ color: 'var(--text-muted)' }}>
            Del
          </button>
        </div>
      </div>
      <div className="sectionEditorBody">
        {renderEditor()}
      </div>
    </div>
  );
}
