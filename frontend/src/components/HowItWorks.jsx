import React from 'react';

const steps = [
  {
    title: 'Choose a campaign',
    desc: 'Browse verified causes with clear goals, images, and progress updates.',
  },
  {
    title: 'Pick your donation type',
    desc: 'Zakat, Sadaqah, Fitra, or General giving—organized for clarity and intent.',
  },
  {
    title: 'Pay securely & get a receipt',
    desc: 'Instant confirmation and downloadable receipts for peace of mind and records.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-sky-300">Simple, guided giving</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">How it works</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              A calm, step-by-step flow designed to inspire generosity and reduce friction.
            </p>
          </div>
          <div className="hidden sm:block">
            <a href="#donate" className="rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-95 transition">
              Start donating
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <div key={step.title} className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur-none md:backdrop-blur hover:bg-white/10 transition">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <span className="text-sm font-semibold text-emerald-200">0{idx + 1}</span>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400/25 to-blue-400/15 opacity-0 blur-xl transition group-hover:opacity-100" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-100">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{step.desc}</p>
            </div>
          ))}
        </div>

        <div id="donate" className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur-none md:backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Ready to give?</h3>
              <p className="mt-1 text-sm text-slate-300">This is the landing page—donation flow screens come next.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <a href="#campaigns" className="rounded-2xl bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 transition">Browse campaigns</a>
              <a href="#campaigns" className="rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 hover:opacity-95 transition">Donate now</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
