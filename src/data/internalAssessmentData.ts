import { AssessmentDossier } from '../types/internal';

export const INTERNAL_ASSESSMENT_DOSSIER: AssessmentDossier = {
  studentName: 'Siya',
  submissionDeadline: '24 October 2026',
  allRequirementsPassed: true,
  records: [
    {
      storyId: 'dispatch-night-shift',
      slotId: 'LONG-01',
      wordCount: 1051,
      isWordCountValid: true, // meets 1,000–1,500 word guideline
      isFormatValid: true,
      hasMediaOrPhotos: true,
      hasSources: true,
      hasContributions: true,
      contributionLog: [
        {
          contributorId: 'siya',
          contributorName: 'Siya',
          role: 'Lead Reporter / Researcher',
          contributionSummary: 'Conducted overnight field interviews across three shifts (11 PM - 7 AM), researched facilities staffing budgets, and drafted the primary reporting narrative (1,051 words).',
        },
        {
          contributorId: 'maya',
          contributorName: 'Maya Chen',
          role: 'Photographer',
          contributionSummary: 'Photographed three ambient low-light documentary frames of nocturnal operations across the central science quad.',
        },
        {
          contributorId: 'marcus',
          contributorName: 'Marcus Vance',
          role: 'Staff Researcher',
          contributionSummary: 'Compiled night transit logs and researched provincial comparative wage briefs under FOI guidelines.',
        },
      ],
      issues: [],
    },
    {
      storyId: 'dispatch-algorithm-archive',
      slotId: 'LONG-02',
      wordCount: 380,
      isWordCountValid: true, // Audio format: 07:42 duration (meets 5-10 min guideline)
      isFormatValid: true,
      hasMediaOrPhotos: true,
      hasSources: true,
      hasContributions: true,
      contributionLog: [
        {
          contributorId: 'siya',
          contributorName: 'Siya',
          role: 'Audio Producer & Host',
          contributionSummary: 'Conducted expert interviews with archive director Prof. Morales, co-wrote the 8-minute investigative script, and hosted the vocal narration.',
        },
        {
          contributorId: 'liam',
          contributorName: 'Liam O’Connor',
          role: 'Audio Engineer',
          contributionSummary: 'Engineered studio acoustic capture, recorded room tone in library archives, mixed multi-track audio, and mastered to -16 LUFS broadcast standards.',
        },
        {
          contributorId: 'priya',
          contributorName: 'Priya Patel',
          role: 'Fact-Checker',
          contributionSummary: 'Verified timeline of campus digital CMS migrations and fact-checked archive accessibility statistics.',
        },
      ],
      issues: [],
    },
    {
      storyId: 'dispatch-darkroom-analog',
      slotId: 'SHORT-01',
      wordCount: 220,
      isWordCountValid: true, // Photo feature: 8 documentary frames (meets 7-10 photo guideline)
      isFormatValid: true,
      hasMediaOrPhotos: true,
      hasSources: true,
      hasContributions: true,
      contributionLog: [
        {
          contributorId: 'maya',
          contributorName: 'Maya Chen',
          role: 'Photographer',
          contributionSummary: 'Shot all eight documentary medium-format film frames under ambient red safelight and controlled dim conditions; developed and digitized photographic prints.',
        },
        {
          contributorId: 'siya',
          contributorName: 'Siya',
          role: 'Writer',
          contributionSummary: 'Curated the photographic sequence, conducted interviews with student film practitioners, and authored the introductory narrative and detailed frame captions.',
        },
      ],
      issues: [],
    },
    {
      storyId: 'dispatch-mutual-aid-kitchen',
      slotId: 'SHORT-02',
      wordCount: 180,
      isWordCountValid: true, // Video report: 01:52 duration (112s, meets 90-120s guideline)
      isFormatValid: true,
      hasMediaOrPhotos: true,
      hasSources: true,
      hasContributions: true,
      contributionLog: [
        {
          contributorId: 'siya',
          contributorName: 'Siya',
          role: 'Reporter',
          contributionSummary: 'Field-reported morning meal distribution, conducted verified on-camera interviews with volunteer leads, and authored the short video narration.',
        },
        {
          contributorId: 'liam',
          contributorName: 'Liam O’Connor',
          role: 'Videographer & Editor',
          contributionSummary: 'Shot handheld documentary video footage across prep, cooking, and service; edited the 112-second package, performed audio leveling and color grading.',
        },
      ],
      issues: [],
    },
  ],
};
