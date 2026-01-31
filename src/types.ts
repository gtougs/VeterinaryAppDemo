export type Species = 'canine' | 'feline' | 'equine' | 'other';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  dob: string; // ISO
  weightKg: number;
  photoUrl: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface PatientRecord {
  id: string;
  pet: Pet;
  owner: Owner;
  status: 'active' | 'paused' | 'pending';
  lastCheckIn: string;
  protocolCount: number;
  alerts: string[];
}

export interface DoseSlot {
  datetimeISO: string;
  status: 'due' | 'logged' | 'missed';
  loggedAt?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  category: 'chemo' | 'peptide' | 'stem-cell';
  dose: { amount: number; unit: string };
  route: string;
  frequency: string;
  schedule: DoseSlot[];
  remaining: number;
  instructions: string;
}

export interface Protocol {
  id: string;
  name: string;
  intent: string;
  startDate: string;
  endDate?: string;
  meds: Medication[];
}

export interface AdverseEvent {
  id: string;
  occurredAt: string;
  severity: 'mild' | 'mod' | 'sev';
  symptom: string;
  notes: string;
  photoUrl?: string;
}

export interface LabResult {
  id: string;
  type: string;
  collectedAt: string;
  fileUrl: string;
  summary: string;
}

export interface Vital {
  weightKg: number;
  recordedAt: string;
  tempC?: number;
  hr?: number;
  rr?: number;
}

export interface LogEntry {
  id: string;
  medName: string;
  loggedAt: string;
  notes?: string;
}

export interface PatientDetail extends PatientRecord {
  adherence: number;
  daysLeft: number;
  protocols: Protocol[];
  adverseEvents: AdverseEvent[];
  labResults: LabResult[];
  vitals: Vital[];
  logs: LogEntry[];
}

// Owner-facing add-ons
export interface OwnerTask {
  id: string;
  title: string;
  dueAt: string;
  status: 'due' | 'overdue' | 'done';
  type: 'med' | 'visit' | 'monitor';
}

export interface OutcomeEntry {
  label: string; // e.g., D1, D2
  appetite: number; // 0-10
  energy: number; // 0-10
  pain: number; // 0-10
  notedAt: string;
}

export interface CaseExample {
  id: string;
  title: string;
  species: Species;
  scenario: string;
  plan: string;
  watchouts: string[];
  severity: 'routine' | 'urgent' | 'emergent';
}

export interface KnowledgeSnippet {
  id: string;
  title: string;
  source: string;
  tags: string[];
  takeaway: string;
}
