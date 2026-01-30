import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  PawPrint,
  Stethoscope,
  Syringe,
  Brain,
  BotMessageSquare,
  GraduationCap,
  Bell,
  Search,
  Menu,
  ArrowRight,
  Activity,
  ShieldCheck,
  Sparkles,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import { useUI } from './state/ui';
import { patientDetail, patients } from './data/mockSeed';
import type { LogEntry, Medication, PatientRecord } from './types';
import { useDropzone } from 'react-dropzone';
import './index.css';

const badges = {
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-amber-100 text-amber-700',
  pending: 'bg-slate-200 text-slate-700',
};

const statusLabel: Record<Medication['category'], string> = {
  chemo: 'Chemo',
  peptide: 'Peptide',
  'stem-cell': 'Stem Cell',
};

function App() {
  const { view, setView } = useUI();

  return (
    <div className="min-h-screen text-slate-900">
      <Navbar onNav={setView} />
      {view === 'landing' && <Landing />}
      {view === 'owner' && <OwnerApp />}
      {view === 'clinic' && <ClinicDashboard />}
    </div>
  );
}

function Navbar({ onNav }: { onNav: (v: 'landing' | 'owner' | 'clinic') => void }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur border-b border-slate-200/60 bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <PawPrint className="h-6 w-6 text-primary-600" />
          <span>VetCare OS</span>
        </div>
        <div className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          <button className="hover:text-primary-600" onClick={() => onNav('landing')}>
            Features
          </button>
          <button className="hover:text-primary-600" onClick={() => onNav('clinic')}>
            For Clinics
          </button>
          <button className="hover:text-primary-600" onClick={() => onNav('owner')}>
            For Owners
          </button>
        </div>
        <div className="flex gap-3">
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:border-primary-500 hover:text-primary-600"
            onClick={() => onNav('clinic')}
          >
            Clinic Demo
          </button>
          <button
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-primary-700"
            onClick={() => onNav('owner')}
          >
            Owner Demo
          </button>
        </div>
      </div>
    </header>
  );
}

function Landing() {
  const { setView } = useUI();
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12">
      <section className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <Sparkles className="h-4 w-4" /> Outpatient veterinary operating system
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Track chemo, peptides, and stem-cell care—safely and proactively.
          </h1>
          <p className="text-lg text-slate-700">
            VetCare OS keeps owners on schedule, captures adverse events, and syncs with ezyVet so your
            care team always sees the latest dosing and labs.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full bg-primary-600 px-5 py-3 text-white font-semibold hover:bg-primary-700 shadow-card"
              onClick={() => setView('owner')}
            >
              Demo Owner App
            </button>
            <button
              className="rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-800 hover:border-primary-500 hover:text-primary-700"
              onClick={() => setView('clinic')}
            >
              Demo Clinic Dashboard
            </button>
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              PHI-ready storage (signed URLs)
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary-600" />
              Adherence + adverse event monitoring
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between text-slate-700">
            <div className="flex items-center gap-2">
              <BotMessageSquare className="h-5 w-5 text-primary-600" />
              <span className="font-semibold">AI Check-in Preview</span>
            </div>
            <span className="text-xs text-slate-500">Realtime safety guardrails</span>
          </div>
          <div className="space-y-3 text-sm">
            <ChatBubble sender="user" text="Milo skipped carboplatin yesterday, what should I do?" />
            <ChatBubble
              sender="ai"
              text="Log the missed dose, check vitals, and notify your oncologist. Do not double-dose. I can draft a note for the clinic."
            />
            <ChatBubble sender="user" text="Also mild vomiting overnight." />
            <ChatBubble
              sender="ai"
              text="Monitor hydration, small meals this morning. If vomiting repeats or lethargy appears, contact clinic within 12 hours."
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">Built for both sides of care</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Syringe className="h-5 w-5" />}
            title="Smart dosing"
            desc="Next-dose cards, countdowns, reconstitution calculators, and offline-safe logging."
          />
          <FeatureCard
            icon={<Stethoscope className="h-5 w-5" />}
            title="Adverse event capture"
            desc="Owners can log vomiting, diarrhea, pain scores, and attach photos for triage."
          />
          <FeatureCard
            icon={<Brain className="h-5 w-5" />}
            title="AI protocol assistant"
            desc="Doctors generate protocol drafts, owners get safe guidance with clear disclaimers."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-slate-700">{desc}</p>
    </div>
  );
}

function OwnerApp() {
  const { ownerTab, setOwnerTab, setView } = useUI();
  const nextDose = patientDetail.protocols[0].meds[0];
  const weightTrend = patientDetail.vitals.map((v, i) => ({ label: `D${i + 1}`, weight: v.weightKg }));

  const tabButton = (tab: typeof ownerTab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setOwnerTab(tab)}
      className={`flex flex-1 flex-col items-center gap-1 py-3 text-sm font-medium ${
        ownerTab === tab ? 'text-primary-700' : 'text-slate-500'
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          ownerTab === tab ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {icon}
      </div>
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Owner-facing</p>
          <h2 className="text-2xl font-bold">Mobile dosing assistant</h2>
        </div>
        <button className="text-sm text-primary-700 underline" onClick={() => setView('landing')}>
          Back to Landing
        </button>
      </div>
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
        <div className="hidden flex-1 text-slate-600 md:block">
          <h3 className="mb-3 text-lg font-semibold">What you&apos;ll see</h3>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>• Next-dose countdown with safety instructions.</li>
            <li>• Quick logging with notes and pain scale.</li>
            <li>• AI chat for safe, guarded Q&A (no dosing changes).</li>
            <li>• Upload stool images for triage; clinic notified.</li>
          </ul>
        </div>
        <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-primary-500/10">
          <div className="rounded-t-[32px] bg-slate-50 px-5 py-3 text-center text-xs text-slate-500">
            Milo • Golden Retriever • 5 yrs
          </div>
          <div className="p-5">
            {ownerTab === 'home' && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-cyan-600 p-5 text-white shadow-md">
                  <p className="text-sm opacity-90">Next dose</p>
                  <h3 className="text-2xl font-bold">{nextDose.name}</h3>
                  <p className="text-sm opacity-90">
                    {nextDose.dose.amount}
                    {nextDose.dose.unit} • {nextDose.frequency}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                    <CalendarClock className="h-4 w-4" />
                    Due in 1 hr
                  </div>
                  <button className="mt-4 w-full rounded-xl bg-white/20 py-2 font-semibold text-white backdrop-blur hover:bg-white/30">
                    Log dose now
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Adherence" value="94%" />
                  <StatCard label="Days left" value="14" />
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Weight trend</p>
                    <span className="text-xs text-slate-500">past week</span>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weightTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="weight" fill="#1585a0" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {ownerTab === 'protocol' && (
              <div className="space-y-3">
                {patientDetail.protocols.flatMap((p) => p.meds).map((med) => (
                  <MedCard key={med.id} med={med} />
                ))}
                <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-4 text-white">
                  <p className="text-sm opacity-80">Tool</p>
                  <h4 className="font-semibold">Reconstitution calculator</h4>
                  <p className="text-sm opacity-80">Set volume & concentration; we’ll auto-calc draw amount.</p>
                  <button className="mt-3 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25">
                    Open tool
                  </button>
                </div>
              </div>
            )}

            {ownerTab === 'ai' && <OwnerChat />}
            {ownerTab === 'learn' && <LearnTab />}
          </div>
          <div className="grid grid-cols-4 border-t border-slate-200 bg-white/80">
            {tabButton('home', 'Home', <PawPrint className="h-4 w-4" />)}
            {tabButton('protocol', 'Protocol', <Syringe className="h-4 w-4" />)}
            {tabButton('ai', 'Ask AI', <BotMessageSquare className="h-4 w-4" />)}
            {tabButton('learn', 'Learn', <GraduationCap className="h-4 w-4" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function MedCard({ med }: { med: Medication }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{statusLabel[med.category]}</p>
          <h4 className="text-lg font-semibold">{med.name}</h4>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {med.remaining} left
        </span>
      </div>
      <p className="text-sm text-slate-700">
        {med.dose.amount}
        {med.dose.unit} • {med.route} • {med.frequency}
      </p>
      <p className="mt-1 text-xs text-slate-500">{med.instructions}</p>
    </div>
  );
}

function OwnerChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: 'When should I give the next BPC shot?' },
    { id: 2, sender: 'ai', text: 'Your next dose is in 1 hour. Keep rotating injection sites.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const { uploadProgress, setUploadProgress } = useUI();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle');
  const [uploadName, setUploadName] = useState('');

  // Mock signed URL request + upload progression
  const simulateUpload = (file: File) => {
    setUploadStatus('uploading');
    setUploadName(file.name);
    setUploadProgress(5);
    setTimeout(() => setUploadProgress(35), 300);
    setTimeout(() => setUploadProgress(70), 700);
    setTimeout(() => {
      setUploadProgress(100);
      setUploadStatus('uploaded');
      setMessages((m) => [
        ...m,
        { id: Date.now(), sender: 'user', text: `Uploaded image: ${file.name}` },
        {
          id: Date.now() + 1,
          sender: 'ai',
          text:
            'Image received securely. No obvious parasites. If you see blood or repeated diarrhea, contact the clinic within 12 hours.',
        },
      ]);
      setTimeout(() => setUploadProgress(null), 600);
    }, 1200);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0];
      if (file) simulateUpload(file);
    },
  });

  const send = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now(), sender: 'user', text: input.trim() };
    setMessages((m) => [...m, newMessage]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text:
            'For safety, do not change dose without your clinic. If vomiting or diarrhea occurs, log it and contact the care team.',
        },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-3">
      <div className="h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} sender={msg.sender as 'user' | 'ai'} text={msg.text} />
        ))}
        {typing && <ChatBubble sender="ai" text="Typing..." muted />}
      </div>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer items-center gap-2 rounded-xl border border-dashed px-3 py-2 text-sm ${
          isDragActive ? 'border-primary-500 bg-primary-50/50 text-primary-700' : 'border-slate-300 bg-white text-slate-600'
        }`}
      >
        <input {...getInputProps()} />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attach photo</span>
        <span className="text-sm">Drop or click to upload fecal image (JPG/PNG)</span>
      </div>
      {uploadStatus !== 'idle' && (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">{uploadName || 'Uploading...'}</span>
            <span className="text-xs text-slate-500">
              {uploadStatus === 'uploaded' ? 'Uploaded' : `${uploadProgress ?? 0}%`}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full ${uploadStatus === 'uploaded' ? 'bg-emerald-500' : 'bg-primary-600'}`}
              style={{ width: `${uploadProgress ?? 0}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Files are sent via short-lived signed URL; nothing is stored after triage preview.
          </p>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about timing, side effects..."
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500"
        />
        <button
          onClick={send}
          className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Send
        </button>
      </div>
      <p className="text-[11px] text-slate-500">
        AI is not a veterinarian. For emergencies, contact your clinic immediately.
      </p>
    </div>
  );
}

function ChatBubble({ sender, text, muted }: { sender: 'user' | 'ai'; text: string; muted?: boolean }) {
  const isUser = sender === 'user';
  return (
    <div className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
          isUser ? 'bg-primary-600 text-white' : 'bg-white text-slate-800'
        } ${muted ? 'opacity-70' : ''}`}
      >
        {text}
      </div>
    </div>
  );
}

function LearnTab() {
  const cards = [
    { title: 'When to call your vet', duration: '3 min read' },
    { title: 'Managing chemo nausea', duration: '6 min read' },
    { title: 'Injection site rotation', duration: '4 min read' },
  ];
  return (
    <div className="grid gap-3">
      {cards.map((c) => (
        <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">{c.title}</h4>
          <p className="text-xs text-slate-500">{c.duration}</p>
        </div>
      ))}
    </div>
  );
}

function ClinicDashboard() {
  const [selected, setSelected] = useState<PatientRecord | null>(patients[0]);
  const detail = useMemo(() => patientDetail, []);
  const meds = detail.protocols.flatMap((p) => p.meds);

  return (
    <div className="grid min-h-screen grid-cols-[280px,1fr] bg-slate-25">
      <aside className="hidden border-r border-slate-200 bg-white/80 px-4 py-6 md:block">
        <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
          <Stethoscope className="h-5 w-5 text-primary-600" />
          VetCare Clinic
        </div>
        <nav className="space-y-2 text-sm font-medium text-slate-700">
          {['Dashboard', 'Patients', 'Inbox', 'Lab Results', 'Settings'].map((item) => (
            <a key={item} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100">
              <span className="h-2 w-2 rounded-full bg-primary-500 opacity-70" />
              {item}
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-10 text-sm text-slate-600">
          <p className="font-semibold">Dr. Roberts</p>
          <p className="text-xs text-slate-500">Oncology</p>
        </div>
      </aside>

      <main className="flex flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3">
          <button className="rounded-lg border border-slate-200 p-2 md:hidden">
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold">Live adherence: 94%</span>
          </div>
          <div className="mx-2 h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1 text-sm text-slate-600">
            <Search className="h-4 w-4 text-slate-400" />
            <input className="w-40 bg-transparent outline-none" placeholder="Search patients" />
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Synced with ezyVet
          </div>
        </div>

        <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[1.1fr,1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">Patient directory</p>
              <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold hover:border-primary-500 hover:text-primary-700">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Last check-in</th>
                    <th className="px-4 py-2">Protocols</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-slate-100 hover:bg-primary-50/40"
                      onClick={() => setSelected(p)}
                    >
                      <td className="px-4 py-3 font-semibold">
                        {p.pet.name} <span className="text-xs text-slate-500">({p.pet.breed})</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badges[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{format(new Date(p.lastCheckIn), 'MMM d')}</td>
                      <td className="px-4 py-3">{p.protocolCount}</td>
                      <td className="px-4 py-3 text-primary-700">Open</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Patient detail</p>
                  <h3 className="text-lg font-semibold">{selected?.pet.name}</h3>
                  <p className="text-xs text-slate-500">Owner: {selected?.owner.name}</p>
                </div>
                <button className="rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-700">
                  AI Protocol Assistant
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <InfoChip label="Vitals weight" value={`${patientDetail.vitals.at(-1)?.weightKg ?? 0} kg`} />
                <InfoChip label="Adherence" value={`${Math.round(patientDetail.adherence * 100)}%`} />
                <InfoChip label="Alerts" value={selected?.alerts[0] ?? 'None'} />
                <InfoChip label="Next dose" value="BPC-157 in 1 hr" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">Active protocol</p>
                <button className="text-xs font-semibold text-primary-700">Sync ezyVet</button>
              </div>
              <div className="space-y-3">
                {meds.map((m) => (
                  <div key={m.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">{statusLabel[m.category]}</p>
                        <p className="font-semibold">{m.name}</p>
                      </div>
                      <span className="text-xs text-slate-500">{m.frequency}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {m.dose.amount}
                      {m.dose.unit} • {m.route}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">Recent logs</p>
                <button className="text-xs font-semibold text-primary-700">View all</button>
              </div>
              <div className="space-y-2">
                {patientDetail.logs.map((log: LogEntry) => (
                  <div key={log.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                    <div>
                      <p className="font-semibold">{log.medName}</p>
                      <p className="text-xs text-slate-500">{format(new Date(log.loggedAt), 'PPp')}</p>
                    </div>
                    <p className="text-xs text-slate-600">{log.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function CalendarClock(props: React.SVGProps<SVGSVGElement>) {
  return <ArrowRight {...props} />;
}

export default App;
