'use client';

import React, { useRef } from 'react';
import type { Header } from '@/lib/schemas/resume';
import type { CVTemplate } from '@/lib/schemas/template';

interface HeaderEditorProps {
  header: Header;
  template: CVTemplate;
  onChange: (updates: Partial<Header>) => void;
}

export default function HeaderEditor({ header, template, onChange }: HeaderEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Resize to 200px width for storage efficiency
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 200;
        const scale = maxW / img.width;
        canvas.width = maxW;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        onChange({ photo: canvas.toDataURL('image/jpeg', 0.8) });
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="sectionEditor">
      <div className="sectionEditorHeader">
        <div className="sectionHeaderLeft">
          <span className="sectionTypeTag">Header</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Personal Information</span>
        </div>
      </div>
      <div className="sectionEditorBody">
        <div className="entryCard">
          <div className="entryRow">
            <div className="entryField">
              <label>Full Name</label>
              <input value={header.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Your Name" />
            </div>
            <div className="entryField">
              <label>Roll Number</label>
              <input value={header.rollNumber || ''} onChange={(e) => onChange({ rollNumber: e.target.value })} placeholder="00XX00000" />
            </div>
          </div>
          <div className="entryRow">
            <div className="entryField">
              <label>Institution</label>
              <input value={header.institution} onChange={(e) => onChange({ institution: e.target.value })} />
            </div>
            <div className="entryField">
              <label>Department</label>
              <input value={header.department || ''} onChange={(e) => onChange({ department: e.target.value })} />
            </div>
          </div>
          <div className="entryRow">
            <div className="entryField">
              <label>Degree</label>
              <input value={header.degree || ''} onChange={(e) => onChange({ degree: e.target.value })} placeholder="B.Tech" />
            </div>
            {template.header.showGender && (
              <div className="entryField">
                <label>Gender</label>
                <input value={header.gender || ''} onChange={(e) => onChange({ gender: e.target.value })} placeholder="Male / Female" />
              </div>
            )}
            {template.header.showDOB && (
              <div className="entryField">
                <label>Date of Birth</label>
                <input value={header.dob || ''} onChange={(e) => onChange({ dob: e.target.value })} placeholder="01/01/2002" />
              </div>
            )}
          </div>
          {template.header.showPhoto && (
            <div className="entryRow" style={{ alignItems: 'center' }}>
              <div className="entryField">
                <label>Profile Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {header.photo && (
                    <img src={header.photo} alt="Photo" style={{ width: 48, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-subtle)' }} />
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <button className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
                    {header.photo ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {header.photo && (
                    <button className="btn btn-danger btn-sm" onClick={() => onChange({ photo: '' })}>Remove</button>
                  )}
                </div>
                {template.id === 'iitkgp' && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                    Note: According to new CDC rules, resumes will not have a picture. This option is kept for backwards compatibility.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
