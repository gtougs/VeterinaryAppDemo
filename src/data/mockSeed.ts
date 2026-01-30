import { formatISO, subDays, addHours } from 'date-fns';
import type {
  AdverseEvent,
  LabResult,
  Medication,
  PatientDetail,
  PatientRecord,
  Protocol,
  Vital,
} from '../types';

const now = new Date();

const buildSchedule = (hours: number[]): Medication['schedule'] =>
  hours.map((h, idx) => ({
    datetimeISO: addHours(now, h).toISOString(),
    status: idx === 0 ? 'due' : 'logged',
    loggedAt: idx === 0 ? undefined : subDays(now, 1).toISOString(),
    notes: idx === 0 ? undefined : 'Owner logged dose on time',
  }));

const meds: Medication[] = [
  {
    id: 'med-bpc',
    name: 'BPC-157',
    category: 'peptide',
    dose: { amount: 250, unit: 'mcg' },
    route: 'Subcutaneous',
    frequency: 'Every morning',
    schedule: buildSchedule([1, -10, -34]),
    remaining: 18,
    instructions: 'Inject subcutaneously in alternating sites.',
  },
  {
    id: 'med-carboplatin',
    name: 'Carboplatin',
    category: 'chemo',
    dose: { amount: 300, unit: 'mg/m2' },
    route: 'IV',
    frequency: 'Every 21 days',
    schedule: buildSchedule([48, -400]),
    remaining: 2,
    instructions: 'Administer with antiemetic pre-medication.',
  },
  {
    id: 'med-stem',
    name: 'Adipose Stem Cell',
    category: 'stem-cell',
    dose: { amount: 30, unit: 'M cells' },
    route: 'Intra-articular',
    frequency: 'Single series (knee)',
    schedule: buildSchedule([72]),
    remaining: 1,
    instructions: 'Sedation required; monitor joint swelling.',
  },
];

const protocols: Protocol[] = [
  {
    id: 'prot-chemo',
    name: 'Osteosarcoma Chemo Adjunct',
    intent: 'Reduce recurrence risk post-amputation',
    startDate: formatISO(subDays(now, 28)),
    meds: [meds[1]],
  },
  {
    id: 'prot-peptide',
    name: 'GI Healing & Recovery',
    intent: 'Support GI mucosa and appetite',
    startDate: formatISO(subDays(now, 7)),
    meds: [meds[0]],
  },
  {
    id: 'prot-stem',
    name: 'Ortho Stem Cell Series',
    intent: 'Knee joint comfort and mobility',
    startDate: formatISO(subDays(now, 3)),
    meds: [meds[2]],
  },
];

const adverseEvents: AdverseEvent[] = [
  {
    id: 'ae-1',
    occurredAt: formatISO(subDays(now, 1)),
    severity: 'mild',
    symptom: 'Vomiting x1 overnight',
    notes: 'Resolved without meds; ate breakfast.',
  },
  {
    id: 'ae-2',
    occurredAt: formatISO(subDays(now, 5)),
    severity: 'mod',
    symptom: 'Lethargy',
    notes: 'Lasted 4 hours; improved after walk.',
  },
];

const labResults: LabResult[] = [
  {
    id: 'lab-1',
    type: 'CBC / Chem',
    collectedAt: formatISO(subDays(now, 6)),
    fileUrl: '#',
    summary: 'Mild neutropenia; liver values within normal limits.',
  },
  {
    id: 'lab-2',
    type: 'Fecal PCR',
    collectedAt: formatISO(subDays(now, 2)),
    fileUrl: '#',
    summary: 'Negative for parasites; flora balanced.',
  },
];

const vitals: Vital[] = [
  { weightKg: 32.4, recordedAt: formatISO(subDays(now, 7)) },
  { weightKg: 32.1, recordedAt: formatISO(subDays(now, 3)) },
  { weightKg: 31.9, recordedAt: formatISO(subDays(now, 1)) },
];

const logs = [
  { id: 'log-1', medName: 'BPC-157', loggedAt: formatISO(subDays(now, 1)), notes: 'Injected right flank' },
  { id: 'log-2', medName: 'Carboplatin', loggedAt: formatISO(subDays(now, 5)), notes: 'Tolerated well' },
];

export const patients: PatientRecord[] = [
  {
    id: 'p-1',
    pet: {
      id: 'pet-1',
      name: 'Milo',
      species: 'canine',
      breed: 'Golden Retriever',
      dob: '2019-05-01',
      weightKg: 32,
      photoUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=400&q=60',
    },
    owner: { id: 'o-1', name: 'Alicia Torres', email: 'alicia@example.com', phone: '555-201-9000' },
    status: 'active',
    lastCheckIn: formatISO(subDays(now, 1)),
    protocolCount: 3,
    alerts: ['Follow-up labs due in 3 days'],
  },
  {
    id: 'p-2',
    pet: {
      id: 'pet-2',
      name: 'Juniper',
      species: 'feline',
      breed: 'Domestic Shorthair',
      dob: '2020-09-12',
      weightKg: 4.8,
      photoUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=60',
    },
    owner: { id: 'o-2', name: 'Colin Peters', email: 'colin@example.com', phone: '555-333-1122' },
    status: 'pending',
    lastCheckIn: formatISO(subDays(now, 3)),
    protocolCount: 1,
    alerts: ['Consent form pending'],
  },
];

export const patientDetail: PatientDetail = {
  ...patients[0],
  adherence: 0.94,
  daysLeft: 14,
  protocols,
  adverseEvents,
  labResults,
  vitals,
  logs,
};
