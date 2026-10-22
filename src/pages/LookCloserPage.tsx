import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Eye, CheckCircle2, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  fieldNote: string;
  category: string;
  timestamp: string;
}

const FIELD_HOTSPOTS: Hotspot[] = [
  {
    id: 'h1',
    x: 32,
    y: 44,
    title: 'High-Pressure Steam Boiler Dial #3',
    fieldNote: 'Shadowed plant operator Arthur Pendelton at 2:40 AM. This analog brass dial regulates pressurized steam to sixty-eight campus complexes. A 2.4°C temperature drop triggers automated alarm thresholds in biological cryo-archives.',
    category: 'Operational Telemetry',
    timestamp: 'Shift 02 • 02:40 AM',
  },
  {
    id: 'h2',
    x: 64,
    y: 36,
    title: 'Subterranean Utility Tunnel Access Shaft',
    fieldNote: 'Concealed steel hatch leading to 4.2 km of underground concrete tunnels where hazardous radiological waste is carted between 2:00 AM and 4:30 AM before daytime student foot traffic convenes.',
    category: 'Hazardous Waste Logistics',
    timestamp: 'Shift 01 • 03:15 AM',
  },
  {
    id: 'h3',
    x: 48,
    y: 72,
    title: 'Custodial Shift Log & Sanitation Manifest',
    fieldNote: 'Lead supervisor Teresa Delgado’s handwritten night ledger. Over eighteen years of night shifts, this log recorded 180 nocturnal personnel across fourteen academic clusters.',
    category: 'Labor Verification',
    timestamp: 'Shift 03 • 04:10 AM',
  },
];

interface TimelineEvent {
  time: string;
  phase: string;
  headline: string;
  description: string;
  reporterObservation: string;
  sourceRef: string;
}

const REPORTING_TIMELINE: TimelineEvent[] = [
  {
    time: '11:15 PM',
    phase: 'Shift Intake & Perimeter Lock',
    headline: 'The Campus Changes Hands',
    description: 'Undergraduate library closes its double glass doors. 180 nocturnal employees clock in across facilities, safety escorts, and lab maintenance.',
    reporterObservation: 'Observed custodial crew assembling outside Science North basement. Contrast between fatigued students leaving and focused workers starting their day.',
    sourceRef: 'Facilities Shift Log FY2025-26',
  },
  {
    time: '01:00 AM',
    phase: 'Precision Spectroscopy Window',
    headline: 'Nanotechnology Cleanrooms Enter Positive Pressure',
    description: 'High-precision electron microscopes begin overnight calibrations to avoid day-time surface vibrations caused by buses on University Boulevard.',
    reporterObservation: 'Documented cleanroom technician entering three air-shower decontamination chambers in protective Tyvek garments.',
    sourceRef: 'Nanotechnology Research Protocol #NT-08',
  },
  {
    time: '03:15 AM',
    phase: 'Transit & Mutual Care',
    headline: 'SafeWalk Electric Shuttle Peak Demand',
    description: 'Driver Tariq Mansoor logs an average of 412 nightly ride requests for medical interns, student journalists, and night facility staff.',
    reporterObservation: 'Rode passenger loop with driver Tariq. Observed total absence of hierarchy: campus security, custodial workers, and biochemistry postgrads waving to one another in the quiet quad.',
    sourceRef: 'Auxiliary Transit Quarterly Dispatch Log',
  },
  {
    time: '06:45 AM',
    phase: 'Dawn Turnover',
    headline: 'Subterranean Storage and Shift Handoff',
    description: 'Industrial polishers returned to subterranean closets as the first morning daylight strikes the sandstone library tower and day shifts arrive.',
    reporterObservation: 'The campus is mirror-polished and warmed to 21°C before the first 8:30 AM lecture attendees arrive.',
    sourceRef: 'Campus Operations Handoff Register',
  },
];

export const LookCloserPage: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot>(FIELD_HOTSPOTS[0]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  React.useEffect(() => {
    document.title = 'Look Closer: Fieldwork & Evidence — The Dispatch';
  }, []);

  const handleQuizChoice = (index: number) => {
    setSelectedQuizAnswer(index);
    setQuizSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Look Closer: Interactive Journalism' }]} />

      {/* Header */}
      <div className="pb-8 border-b-2 border-ink-900 mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-5 h-5 text-editorial-red" />
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-red font-bold">
            Interactive Journalism Laboratory
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-ink-950 mb-4">
          Look Closer: Fieldwork, Data & Evidence
        </h1>
        <p className="font-serif text-lg sm:text-xl text-ink-700 leading-relaxed max-w-3xl">
          Journalism is not just what is written on the page—it is the process of physical observation, documentary verification, and transparent evidence gathering. Explore our field reporting below.
        </p>
      </div>

      {/* MODULE 1: ANNOTATED FIELDWORK PHOTO EXPLORER */}
      <section className="mb-20" aria-label="Annotated Photo Explorer">
        <div className="flex items-end justify-between pb-3 border-b-2 border-ink-900 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-editorial-red font-bold">
              Feature 01 / Visual Evidence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
              Annotated Documentary Photo Explorer
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-500 hidden sm:inline">
            Click pins to inspect field evidence
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Image with Interactive Hotspots */}
          <div className="lg:col-span-8 bg-ink-950 border-2 border-ink-900 relative overflow-hidden group shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80"
              alt="Nocturnal laboratory cleanroom maintenance"
              className="w-full h-auto aspect-[16/10] object-cover opacity-90"
            />

            {/* Hotspot Markers */}
            {FIELD_HOTSPOTS.map(spot => {
              const isActive = activeHotspot.id === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot)}
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-editorial-red text-white scale-125 ring-4 ring-white shadow-xl z-30'
                      : 'bg-paper-100/90 text-ink-950 hover:bg-editorial-red hover:text-white scale-100 shadow-md z-20'
                  }`}
                  aria-label={`View evidence: ${spot.title}`}
                >
                  <MapPin className="w-4 h-4 fill-current" />
                </button>
              );
            })}

            <div className="absolute bottom-3 left-4 bg-ink-950/90 text-paper-200 font-mono text-[11px] px-3 py-1 border border-white/20">
              Science North Subterranean Infrastructure • Shift Recording #02
            </div>
          </div>

          {/* Interactive Inspection Card */}
          <div className="lg:col-span-4 bg-paper-100 border-2 border-ink-900 p-6 shadow-md flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-rule mb-4 font-mono text-xs">
                <span className="text-editorial-red font-bold uppercase">
                  {activeHotspot.category}
                </span>
                <span className="text-ink-500">{activeHotspot.timestamp}</span>
              </div>

              <h3 className="font-serif text-xl font-bold text-ink-950 mb-3 leading-snug">
                {activeHotspot.title}
              </h3>

              <div className="p-4 bg-paper-200 border border-rule font-serif text-sm text-ink-800 leading-relaxed mb-4">
                "{activeHotspot.fieldNote}"
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-ink-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-editorial-red" />
                <span>Verified Fieldwork Notebook Archive</span>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-rule text-xs font-mono">
              <Link
                to="/story/night-shift-of-campus-care"
                className="text-editorial-red font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Read Full Night Shift Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 2: NOCTURNAL REPORTING CHRONOLOGY TIMELINE */}
      <section className="mb-20" aria-label="Reporting Timeline">
        <div className="pb-3 border-b-2 border-ink-900 mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-editorial-red font-bold">
            Feature 02 / Fieldwork Chronology
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mt-1">
            The Nocturnal Reporting Timeline (11 PM – 7 AM)
          </h2>
          <p className="font-serif text-sm text-ink-600 mt-1">
            Chronological documentation of student reporting across three overnight field shifts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REPORTING_TIMELINE.map((item, idx) => (
            <div
              key={idx}
              className="bg-paper-100 border-2 border-ink-900 p-5 flex flex-col justify-between shadow-xs hover:border-editorial-red transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-rule mb-3">
                  <span className="font-mono text-base font-black text-editorial-red">
                    {item.time}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-ink-500 bg-paper-200 px-2 py-0.5">
                    Stage {idx + 1}
                  </span>
                </div>

                <span className="text-[11px] font-mono uppercase tracking-wider text-ink-500 font-bold block mb-1">
                  {item.phase}
                </span>

                <h3 className="font-serif text-lg font-bold text-ink-950 mb-2 leading-snug">
                  {item.headline}
                </h3>

                <p className="font-serif text-xs text-ink-700 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="p-3 bg-paper-200 border-l-2 border-editorial-red text-xs font-mono text-ink-800 leading-normal mb-3">
                  <strong className="block text-editorial-red text-[10px] uppercase mb-0.5">Reporter Note:</strong>
                  {item.reporterObservation}
                </div>
              </div>

              <div className="pt-2 border-t border-rule text-[10px] font-mono text-ink-500">
                Source: {item.sourceRef}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULE 3: JOURNALISM LITERACY & VERIFICATION EXERCISE */}
      <section className="bg-paper-200 border-2 border-ink-900 p-6 sm:p-10 mb-12" aria-label="Journalism Literacy Exercise">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-editorial-red font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Interactive Headline Literacy & Verification Exercise</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 mb-3">
            Spotting Editorial Integrity vs. Sensationalism
          </h2>
          <p className="font-serif text-sm text-ink-700 leading-relaxed mb-6">
            In modern student journalism, the pressure to produce virality often competes with verified truth. Which of the following two headlines conforms to <em>The Dispatch</em> Code of Practice?
          </p>

          <div className="space-y-4 mb-6">
            <button
              onClick={() => handleQuizChoice(0)}
              className={`w-full text-left p-4 border-2 transition-all font-serif ${
                selectedQuizAnswer === 0
                  ? 'border-red-600 bg-red-50 text-red-950'
                  : 'border-ink-900 bg-paper-50 hover:bg-paper-100 text-ink-950'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1 text-ink-500">
                <span>Option A</span>
                {selectedQuizAnswer === 0 && <span className="text-red-700 font-bold">Unverified Sensationalism</span>}
              </div>
              <strong className="text-lg">
                "BREAKING: Secret Chemical Experiments in Campus Basements Leave Students in Shock!"
              </strong>
            </button>

            <button
              onClick={() => handleQuizChoice(1)}
              className={`w-full text-left p-4 border-2 transition-all font-serif ${
                selectedQuizAnswer === 1
                  ? 'border-green-600 bg-green-50 text-green-950 ring-2 ring-green-600'
                  : 'border-ink-900 bg-paper-50 hover:bg-paper-100 text-ink-950'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1 text-ink-500">
                <span>Option B</span>
                {selectedQuizAnswer === 1 && <span className="text-green-800 font-bold">✓ Verified Editorial Standard</span>}
              </div>
              <strong className="text-lg">
                "The Night Shift of Campus Care: Inside the Invisible Infrastructure Keeping Student Life Moving"
              </strong>
            </button>
          </div>

          {quizSubmitted && (
            <div className={`p-4 border-l-4 text-xs font-mono leading-relaxed ${
              selectedQuizAnswer === 1
                ? 'bg-green-100 border-green-700 text-green-950'
                : 'bg-amber-100 border-amber-600 text-amber-950'
            }`}>
              <strong>{selectedQuizAnswer === 1 ? 'Correct Analysis:' : 'Critical Distinction:'}</strong>{' '}
              Option B reflects professional journalism ethics: it documents verified public operations, provides fair contextual standfirsts, and avoids unverified fear-mongering and manufactured clickbait.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
