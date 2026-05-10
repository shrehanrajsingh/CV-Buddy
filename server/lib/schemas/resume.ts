import { z } from 'zod';

// ── Atomic blocks ──────────────────────────────────

export const LinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  type: z.enum(['github', 'linkedin', 'portfolio', 'scholar', 'email', 'other']),
});

export const EducationEntrySchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  year: z.string(),
  score: z.string(),
  scoreType: z.enum(['cgpa', 'percentage', 'grade']).default('cgpa'),
});

export const ProjectEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  timeline: z.string().optional().default(''),
  supervisor: z.string().optional().default(''),
  bullets: z.array(z.string()),
  links: z.array(LinkSchema).optional().default([]),
});

export const POREntrySchema = z.object({
  id: z.string(),
  role: z.string(),
  organization: z.string(),
  timeline: z.string().optional().default(''),
  bullets: z.array(z.string()),
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  category: z.string(),
  items: z.array(z.string()),
});

export const AchievementSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export const CustomSectionItemSchema = z.object({
  id: z.string(),
  text: z.string(),
});

// ── Section types ──────────────────────────────────

export const EducationSectionSchema = z.object({
  type: z.literal('education'),
  id: z.string(),
  title: z.string().default('Education'),
  entries: z.array(EducationEntrySchema),
});

export const ProjectsSectionSchema = z.object({
  type: z.literal('projects'),
  id: z.string(),
  title: z.string().default('Internships and Projects'),
  entries: z.array(ProjectEntrySchema),
});

export const SkillsSectionSchema = z.object({
  type: z.literal('skills'),
  id: z.string(),
  title: z.string().default('Skills and Expertise'),
  categories: z.array(SkillCategorySchema),
});

export const CourseworkSectionSchema = z.object({
  type: z.literal('coursework'),
  id: z.string(),
  title: z.string().default('Coursework Information'),
  courses: z.array(z.string()),
});

export const PORSectionSchema = z.object({
  type: z.literal('por'),
  id: z.string(),
  title: z.string().default('Positions of Responsibility'),
  entries: z.array(POREntrySchema),
});

export const AchievementsSectionSchema = z.object({
  type: z.literal('achievements'),
  id: z.string(),
  title: z.string().default('Awards and Achievements'),
  items: z.array(AchievementSchema),
});

export const ECASectionSchema = z.object({
  type: z.literal('eca'),
  id: z.string(),
  title: z.string().default('Extra Curricular Activities'),
  items: z.array(z.string()),
});

export const CustomSectionSchema = z.object({
  type: z.literal('custom'),
  id: z.string(),
  title: z.string().default('Custom Section'),
  items: z.array(CustomSectionItemSchema),
});

export const SectionSchema = z.discriminatedUnion('type', [
  EducationSectionSchema,
  ProjectsSectionSchema,
  SkillsSectionSchema,
  CourseworkSectionSchema,
  PORSectionSchema,
  AchievementsSectionSchema,
  ECASectionSchema,
  CustomSectionSchema,
]);

// ── Header ─────────────────────────────────────────

export const HeaderSchema = z.object({
  name: z.string(),
  rollNumber: z.string().optional().default(''),
  institution: z.string(),
  department: z.string().optional().default(''),
  degree: z.string().optional().default(''),
  gender: z.string().optional().default(''),
  dob: z.string().optional().default(''),
  photo: z.string().optional().default(''),
  links: z.array(LinkSchema).optional().default([]),
});

// ── Resume Document ────────────────────────────────

export const ResumeSchema = z.object({
  id: z.string(),
  title: z.string(),
  templateId: z.enum(['iitkgp', 'iitb', 'iitm']),
  header: HeaderSchema,
  sections: z.array(SectionSchema),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.number().int().default(1),
  }),
});

// ── Types ──────────────────────────────────────────

export type Link = z.infer<typeof LinkSchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;
export type POREntry = z.infer<typeof POREntrySchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Header = z.infer<typeof HeaderSchema>;
export type Resume = z.infer<typeof ResumeSchema>;

export type EducationSection = z.infer<typeof EducationSectionSchema>;
export type ProjectsSection = z.infer<typeof ProjectsSectionSchema>;
export type SkillsSection = z.infer<typeof SkillsSectionSchema>;
export type CourseworkSection = z.infer<typeof CourseworkSectionSchema>;
export type PORSection = z.infer<typeof PORSectionSchema>;
export type AchievementsSection = z.infer<typeof AchievementsSectionSchema>;
export type ECASection = z.infer<typeof ECASectionSchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;
export type TemplateId = Resume['templateId'];
