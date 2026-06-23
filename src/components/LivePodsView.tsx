import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LIVE_PODS, POD_DETAILS } from '../data';
import { Shield, Zap, Search, Activity, HelpCircle, Terminal } from 'lucide-react';
import SEO from './SEO';

const LIVE_PODS_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.fwdpod.com/#live-pods',
      'url': 'https://www.fwdpod.com/live-pods',
      'name': 'Live AI Engineering Pod Telemetry & Active Deployments | Fwdpod',
      'description': 'Real-time operational registry of active Fwdpod AI engineering pod deployments across financial services, healthcare, logistics, and more. Verified outcome metrics.',
      'isPartOf': { '@id': 'https://www.fwdpod.com/#website' },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.fwdpod.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Live Telemetry', 'item': 'https://www.fwdpod.com/live-pods' }
        ]
      }
    },
    {
      '@type': 'ItemList',
      'name': 'Active Fwdpod AI Engineering Deployments',
      'description': 'Live and recently completed AI engineering pod engagements across multiple industries',
      'numberOfItems': LIVE_PODS.length,
      'itemListElement': LIVE_PODS.map((pod, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': `${pod.archetype} — ${pod.client}`,
        'description': pod.buildDescription
      }))
    }
  ]
};

const TRACE_SAMPLES = [
  "Voice AI Pod (LifeCare Digital) // Audited latency is at 112ms (Target: <150ms budget).",
  "RAG Pod (Standard Trust India) // Dynamic text chunks indexed. 4,120 active nodes parsed into vectors.",
  "Agentic Ops Pod (Aero Logistics APAC) // Human automation authorization cleared for invoice INV-1049.",
  "Compliance AI Pod (Standard Trust India) // Anonymization scrub verification successfully finished. 0 leaks.",
  "Voice AI Pod (Standard Trust India) // Conversational phone trunk Twilio gateway health check returned 200 OK.",
  "Agentic Ops Pod (Aero Logistics APAC) // Multi-agent routing loop auto-recovered from failed API stage.",
  "RAG Pod (Apollo Health Hubs) // Clinical policy PDF text ingestion synchronized and trace history updated.",
  "Compliance AI Pod (LifeCare Digital) // Audited 18 LLM output blocks against HIPAA strict filtering rules."
];

export default function LivePodsView() {
  // Filter States
  const [selectedArchetype, setSelectedArchetype] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  // Real-time trace states
  const [traces, setTraces] = useState<string[]>([
    "Voice AI Pod (LifeCare Digital) // Audited latency is at 112ms (Target: <150ms budget).",
    "RAG Pod (Standard Trust India) // Dynamic text chunks indexed. 4,120 active nodes indexed.",
    "Agentic Ops Pod (Aero Logistics APAC) // Human automation authorization cleared for invoice INV-1049."
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * TRACE_SAMPLES.length);
      const trace = TRACE_SAMPLES[randomIdx];
      setTraces(prev => {
        if (prev.includes(trace)) return prev;
        return [trace, ...prev.slice(0, 4)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Derive unique categories for select filters
  const archetypes = ['All', ...Array.from(new Set(LIVE_PODS.map(pod => pod.archetype)))];
  const statuses = ['All', 'Running', 'Completed'];
  const industries = ['All', ...Array.from(new Set(LIVE_PODS.map(pod => pod.industry)))];

  // Apply filters
  const filteredPods = LIVE_PODS.filter(pod => {
    const matchArchetype = selectedArchetype === 'All' || pod.archetype === selectedArchetype;
    const matchStatus = selectedStatus === 'All' || pod.status === selectedStatus.toLowerCase();
    const matchIndustry = selectedIndustry === 'All' || pod.industry === selectedIndustry;
    return matchArchetype && matchStatus && matchIndustry;
  });

  // Derived dashboard metrics
  const runningPodsCount = LIVE_PODS.filter(p => p.status === 'running').length;
  const deployedEngineersCount = LIVE_PODS.reduce((sum, pod) => sum + pod.teamSize, 0);
  const distinctIndustries = new Set(LIVE_PODS.map(p => p.industry)).size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-12"
    >
      <SEO
        title="Live AI Engineering Pod Telemetry &amp; Active Deployments | Fwdpod"
        description="Real-time operational registry of active Fwdpod AI engineering pod deployments across financial services, healthcare, logistics, and more. Verified outcome metrics."
        canonical="/live-pods"
        jsonLd={LIVE_PODS_JSON_LD}
      />
      {/* Page Header */}
      <section className="text-center md:text-left space-y-4">
        <span className="text-xs font-mono text-[#0066FF] uppercase tracking-widest font-medium block">
          Operational state // live audited workspace
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-medium text-[#0A0A0A] tracking-tight">
          Live pods. Right now.
        </h1>
        <p className="text-sm text-zinc-600 max-w-xl leading-relaxed">
          A real-time operational registry of all running and recently completed senior engineering pods. Standardized, audited, and completely transparent outputs.
        </p>
      </section>

      {/* Top Stats Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm space-y-2 hover:border-[#0066FF] hover:border-1.5 hover:bg-zinc-50/50 hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-out">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">
            Active pipelines
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-[#0066FF]">
              {runningPodsCount}
            </span>
            <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider font-semibold">pods running</span>
          </div>
          <p className="text-[11px] text-zinc-505 text-zinc-500 leading-relaxed font-sans">Weekly deliverables, tracked via telemetry dashboards.</p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm space-y-2 hover:border-[#0066FF] hover:border-1.5 hover:bg-zinc-50/50 hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-out">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">
            Deployed manpower
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-[#0A0A0A]">
              {deployedEngineersCount}
            </span>
            <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider font-semibold">senior specialists</span>
          </div>
          <p className="text-[11px] text-zinc-505 text-zinc-500 leading-relaxed font-sans">Integrated developers under unified contract ownerships.</p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm space-y-2 hover:border-[#0066FF] hover:border-1.5 hover:bg-zinc-50/50 hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-out">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">
            Enterprise verticals
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-[#0A0A0A]">
              {distinctIndustries}
            </span>
            <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider font-semibold">sectors served</span>
          </div>
          <p className="text-[11px] text-zinc-505 text-zinc-500 leading-relaxed font-sans">Active compliance guardrails deployed inside healthcare, BFSI, telecom.</p>
        </div>
      </section>

      {/* Real-time Telemetry Tracer Feed Console */}
      <section className="border border-zinc-100 p-6 bg-zinc-50/50 text-[#0A0A0A] font-mono space-y-3.5 shadow-sm select-none rounded-3xl hover:border-[#0066FF] hover:border-1.5 hover:bg-zinc-50/50 hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-out">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
          <div className="flex items-center gap-2.5 text-[10px] font-mono text-[#0066FF] uppercase tracking-wider">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0066FF]"></span>
            </span>
            <span className="font-semibold">Live Audit Stream // Trace Feed</span>
          </div>
          <span className="text-[8px] text-zinc-400 font-mono uppercase font-bold tracking-wider">Telemetry Node active</span>
        </div>
        
        <div className="space-y-2 max-h-[140px] overflow-hidden text-[11px]">
          {traces.map((tr, index) => (
            <div 
              key={index}
              className={`flex items-start gap-2 line-clamp-2 transition-all duration-300 ${
                index === 0 ? 'text-[#0A0A0A] font-semibold' : 'text-zinc-500'
              }`}
            >
              <span className="text-[#0066FF] shrink-0 font-bold">{">"}</span>
              <p className="leading-relaxed">{tr}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <section className="bg-white/85 backdrop-blur-md border border-zinc-100 p-5 sticky top-16 z-30 transition-all rounded-3xl shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          
          {/* Archetype Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold tracking-wider block">Pod Archetype</label>
            <select
              value={selectedArchetype}
              onChange={(e) => setSelectedArchetype(e.target.value)}
              className="w-full border border-zinc-200 p-2 px-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] bg-white rounded-full transition-all"
            >
              {archetypes.map(arc => (
                <option key={arc} value={arc}>{arc}</option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold tracking-wider block">Delivery Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-zinc-200 p-2 px-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] bg-white rounded-full transition-all"
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st === 'All' ? 'All (Running & Completed)' : st}</option>
              ))}
            </select>
          </div>

          {/* Industry Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold tracking-wider block">Industry Sector</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full border border-zinc-200 p-2 px-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] bg-white rounded-full transition-all"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Filters Clear Status Bar */}
        {(selectedArchetype !== 'All' || selectedStatus !== 'All' || selectedIndustry !== 'All') && (
          <div className="mt-3 pt-3 border-t border-zinc-100 flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 font-mono">
              Showing {filteredPods.length} matching pods inside the filtered criteria
            </span>
            <button
              onClick={() => {
                setSelectedArchetype('All');
                setSelectedStatus('All');
                setSelectedIndustry('All');
              }}
              className="text-[10px] font-mono text-[#0066FF] hover:underline hover:text-blue-700 transition-colors"
            >
              Clear active filters
            </button>
          </div>
        )}
      </section>

      {/* 12 Sample cards grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPods.map((pod) => {
          const isRunning = pod.status === 'running';
          return (
            <div 
              key={pod.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between bg-white hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-out ${
                isRunning 
                  ? 'border-[#0066FF]/25 hover:border-[#0066FF] hover:border-1.5 hover:bg-zinc-50/50' 
                  : 'border-zinc-200 hover:border-[#0066FF] hover:border-1.5 hover:bg-zinc-50/50'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Sector & Status Indicator */}
                <div className="flex justify-between items-start pb-3.5 border-b border-zinc-100">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#555555] font-semibold block animate-none">
                      {pod.industry}
                    </span>
                    <h4 className="text-sm font-semibold text-[#0A0A0A] font-sans">
                      {pod.client}
                    </h4>
                  </div>

                  {/* Operational Sync Badge */}
                  <span className={`inline-flex items-center gap-2 text-[9px] font-mono px-3 py-1 tracking-wider uppercase rounded-full ${
                    isRunning 
                      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                  }`}>
                    {isRunning ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Running</span>
                      </>
                    ) : (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        <span>Offline</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Body Content */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#0066FF] font-semibold uppercase tracking-wider block">
                    {pod.archetype}
                  </span>
                  <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                    {pod.buildDescription}
                  </p>
                </div>
              </div>

              {/* Dynamic Metric Outcome box - beautifully rounded */}
              {pod.outcomeMetric && (
                <div className="my-4 p-3.5 bg-zinc-50 border-l-[3px] border-[#0066FF] rounded-r-2xl text-[11px] font-mono space-y-1">
                  <div className="text-[8px] uppercase tracking-wide text-zinc-400 font-bold">Verified measured impact:</div>
                  <div className="font-semibold text-[#0066FF] uppercase">{pod.outcomeMetric}</div>
                </div>
              )}

              {/* Bottom Metadata details */}
              <div className="pt-4 mt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500">
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-zinc-400">Timeline span</span>
                  <span className="text-[#0A0A0A] font-semibold font-sans">
                    {isRunning ? `${pod.weeksLive} weeks live` : `${pod.weeksLive} weeks total`}
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-zinc-400">Deployment size</span>
                  <span className="text-[#0A0A0A] font-semibold font-sans">{pod.teamSize} specialists</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state filter */}
        {filteredPods.length === 0 && (
          <div className="col-span-1 md:col-span-3 border border-dashed border-zinc-200 p-12 text-center text-xs space-y-2 text-zinc-500 rounded-3xl bg-zinc-50/50">
            <p>No active telemetry registries match your selected filter criteria.</p>
            <button
              onClick={() => {
                setSelectedArchetype('All');
                setSelectedStatus('All');
                setSelectedIndustry('All');
              }}
              className="text-[#0066FF] hover:underline font-mono font-semibold"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* Bottom transparency notice */}
      <section className="bg-zinc-50/50 p-8 text-xs text-zinc-500 space-y-2.5 leading-relaxed rounded-3xl border border-zinc-100 hover:border-[#0066FF] hover:border-1.5 hover:bg-zinc-50/50 hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-out">
        <h4 className="font-semibold text-zinc-950 font-sans text-sm">Corporate anonymization and security standards audits notice</h4>
        <p>
          In accordance with private master service agreements (MSAs) and system compliance filters, clients signed under active compliance structures (specifically HIPAA, SOC2, and DPDP rules) are anonymized. Named logos (e.g. Apollo Health Hubs) are featured exclusively under explicit client-signed publicity releases. All stated measured outcome metrics are verified using isolated telemetry check cron triggers weekly.
        </p>
      </section>
    </motion.div>
  );
}
