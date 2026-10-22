/**
 * The Dispatch — Internal Academic & Assessment Types
 * Isolated strictly to /editorial/internal for teaching & assessment verification.
 * Never imported or exposed to public readers.
 */

export interface AssignmentSlotRequirement {
  slotId: 'LONG-01' | 'LONG-02' | 'SHORT-01' | 'SHORT-02';
  headline: string;
  requiredFormat: string;
  metricsGuideline: string;
  minWords?: number;
  maxWords?: number;
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
  minPhotos?: number;
}

export interface ContributionLedgerEntry {
  contributorId: string;
  contributorName: string;
  role: string;
  contributionSummary: string;
}

export interface StoryAssessmentRecord {
  storyId: string;
  slotId: 'LONG-01' | 'LONG-02' | 'SHORT-01' | 'SHORT-02';
  wordCount: number;
  isWordCountValid: boolean;
  isFormatValid: boolean;
  hasMediaOrPhotos: boolean;
  hasSources: boolean;
  hasContributions: boolean;
  contributionLog: ContributionLedgerEntry[];
  issues: string[];
}

export interface AssessmentDossier {
  studentName: string;
  submissionDeadline: string;
  records: StoryAssessmentRecord[];
  allRequirementsPassed: boolean;
}
